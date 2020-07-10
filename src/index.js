import path from 'path';
import fs from 'fs';
import { createCanvas } from 'canvas';

const defaultOptions = {
	cellWidth: 100,
	cellHeight: 40,
	offsetLeft: 8,
	offsetTop: 26,
	spacing: 40,
};

const TableRenderer = (options = {}) => {
	const { cellWidth, cellHeight, offsetLeft, offsetTop, spacing } = Object.assign(defaultOptions, options);

	const getWidth = (columns) => columns.reduce((sum, { width = cellWidth }) => sum + width, 0);

	const getHeight = (title, dataSource) => (title ? cellHeight : 0) + cellHeight + dataSource.reduce((height, row) => height + (row === '-' ? 1 : cellHeight), 0);

	const renderBackground = (ctx, width, height) => {
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#ffffff';
		ctx.fillRect(-10, -10, width + 10, height + 10);
	};

	const renderHorizontalLines = (ctx) => (dataSource, { y, width }) => {
		ctx.strokeStyle = '#000000';
		dataSource.forEach((row, i) => {
			if (row !== '-') return;
			ctx.moveTo(0, y[i]);
			ctx.lineTo(width, y[i]);
			ctx.stroke();
		});
	};

	const renderTitle = (ctx) => (title, { top }) => {
		ctx.font = 'bold 24px sans-serif';
		ctx.fillStyle = '#000000';
		ctx.textAlign = 'left';
		ctx.fillText(title, offsetLeft, top + offsetTop);
	};

	const renderHeader = (ctx) => (columns, { x, y }) => {
		ctx.font = 'normal 16px sans-serif';
		ctx.fillStyle = '#333333';
		columns.forEach(({ title, width = cellWidth, align = 'left' }, i) => {
			ctx.textAlign = align;
			ctx.fillText(title, x[i] + (align === 'right' ? width - offsetLeft : offsetLeft), y[0] - cellHeight + offsetTop);
		});
	};

	const renderRows = (ctx) => (columns, dataSource, { x, y }) => {
		dataSource.forEach((row, i) => {
			if (row === '-') return;
			columns.forEach(({ width = cellWidth, dataIndex, align = 'left', prefix = '', suffix = '' }, j) => {
				if (!row[dataIndex]) return;
				const content = prefix + row[dataIndex] + suffix;
				ctx.textAlign = align;
				ctx.fillText(content, x[j] + (align === 'right' ? width - offsetLeft : offsetLeft), y[i] + offsetTop, width - 2 * offsetLeft);
			});
		});
	};

	const renderTable = ({ title, columns, dataSource }, { ctx, width, height, top = 0 }) => {
		const info = {
			width,
			height,
			top,
			x: new Array(columns.length).fill().map((_, i) => columns.reduce((x, { width = cellWidth }, j) => x + (j >= i ? 0 : width), 0)),
			y: new Array(dataSource.length).fill().map((_, i) => top + (title ? cellHeight : 0) + cellHeight + dataSource.reduce((y, row, j) => y + (j >= i ? 0 : row === '-' ? 1 : cellHeight), 0)),
		};
		renderHorizontalLines(ctx)(dataSource, info);
		renderTitle(ctx)(title, info);
		renderHeader(ctx)(columns, info);
		renderRows(ctx)(columns, dataSource, info);
	};

	const renderTables = (tables, { ctx, width, height }) => {
		tables.forEach(({ title, columns, dataSource }) => {
			const top = tables.reduce((top, { title, dataSource }, j) => top + (j >= i ? 0 : getHeight(title, dataSource)), 0) + i * spacing;
			renderTable({ title, columns, dataSource }, { ctx, width: getWidth(columns), height: getHeight(title, dataSource), top });
		});
	};

	const render = (tables) => {
		if (!Array.isArray(tables)) {
			const { title, columns, dataSource } = tables;
			const width = getWidth(columns);
			const height = getHeight(title, dataSource);
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext('2d');
			renderBackground(ctx, width, height);
			renderTable(tables, { ctx, width, height });
			return canvas;
		} else {
			const width = table.reduce((maxWidth, { columns }) => Math.max(getWidth(columns), maxWidth), 0);
			const height = table.reduce((height, { title, dataSource }) => height + getHeight(title, dataSource), 0) + (table.length - 1) * spacing;
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext('2d');
			renderBackground(ctx, width, height);
			renderTables(tables, { ctx, width, height });
			return canvas;
		}
	};

	return { render };
};

export default TableRenderer;

export const saveImage = async (canvas, filepath) => {
	await new Promise((resolve, reject) => {
		const ws = fs.createWriteStream(filepath);
		ws.on('finish', resolve);
		ws.on('error', reject);
		canvas.createPNGStream().pipe(ws);
	});
};
