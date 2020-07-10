import path from 'path';
import fs from 'fs';
import { registerFont, createCanvas } from 'canvas';

const defaultOptions = {
	cellWidth: 100,
	cellHeight: 40,
	offsetLeft: 8,
	offsetTop: 26,
	spacing: 40,
	fontFamily: 'sans-serif',
};

const TableRenderer = (options = {}) => {
	const { cellWidth, cellHeight, offsetLeft, offsetTop, spacing, fontFamily } = Object.assign(defaultOptions, options);

	const getWidth = (columns) => columns?.reduce((sum, { width = cellWidth }) => sum + width, 0) ?? cellWidth;

	const getHeight = (title, columns, dataSource) =>
		(title ? cellHeight : 0) + (columns?.length > 0 ? cellHeight : 0) + (dataSource?.reduce((height, row) => height + (row === '-' ? 1 : cellHeight), 0) ?? 0);

	const renderBackground = (ctx, width, height) => {
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#ffffff';
		ctx.fillRect(-10, -10, width + 10, height + 10);
	};

	const renderHorizontalLines = (ctx) => (dataSource, { y, width }) => {
		ctx.strokeStyle = '#000000';
		dataSource?.forEach((row, i) => {
			if (row !== '-') return;
			ctx.moveTo(0, y[i]);
			ctx.lineTo(width, y[i]);
			ctx.stroke();
		});
	};

	const renderTitle = (ctx) => (title, titleStyle = {}, { top }) => {
		ctx.font = titleStyle.font ?? `bold 24px ${fontFamily}`;
		ctx.fillStyle = titleStyle?.fillStyle ?? '#000000';
		ctx.textAlign = titleStyle?.textAlign ?? 'left';
		ctx.fillText(title, offsetLeft, top + offsetTop + (titleStyle?.offsetTop ?? 0));
	};

	const renderHeader = (ctx) => (columns, { x, y }) => {
		ctx.font = `normal 16px ${fontFamily}`;
		ctx.fillStyle = '#333333';
		columns?.forEach(({ title, width = cellWidth, align = 'left' }, i) => {
			ctx.textAlign = align;
			ctx.fillText(title, x[i] + (align === 'right' ? width - offsetLeft : offsetLeft), y[0] - cellHeight + offsetTop);
		});
	};

	const renderRows = (ctx) => (columns, dataSource, { x, y }) => {
		dataSource?.forEach((row, i) => {
			if (row === '-') return;
			columns?.forEach(({ width = cellWidth, dataIndex, align = 'left', prefix = '', suffix = '' }, j) => {
				if (!row[dataIndex]) return;
				const content = prefix + row[dataIndex] + suffix;
				ctx.textAlign = align;
				ctx.fillText(content, x[j] + (align === 'right' ? width - offsetLeft : offsetLeft), y[i] + offsetTop, width - 2 * offsetLeft);
			});
		});
	};

	const renderTable = ({ title, titleStyle = {}, columns, dataSource }, { ctx, width, height, top = 0 }) => {
		const info = {
			width,
			height,
			top,
			x: new Array(columns?.length ?? 0).fill().map((_, i) => columns?.reduce((x, { width = cellWidth }, j) => x + (j >= i ? 0 : width), 0)),
			y: new Array(dataSource?.length ?? 0)
				.fill()
				.map((_, i) => top + (title ? cellHeight : 0) + cellHeight + dataSource?.reduce((y, row, j) => y + (j >= i ? 0 : row === '-' ? 1 : cellHeight), 0)),
		};
		renderHorizontalLines(ctx)(dataSource, info);
		renderTitle(ctx)(title, titleStyle, info);
		renderHeader(ctx)(columns, info);
		renderRows(ctx)(columns, dataSource, info);
	};

	const renderTables = (tables, { ctx, width, height }) => {
		tables.forEach((table, i) => {
			const { title, columns, dataSource } = table;
			const top = tables.reduce((top, { title, columns, dataSource }, j) => top + (j >= i ? 0 : getHeight(title, columns, dataSource)), 0) + i * spacing;
			renderTable(table, { ctx, width: getWidth(columns), height: getHeight(title, columns, dataSource), top });
		});
	};

	const render = (tables) => {
		if (!Array.isArray(tables)) {
			const { title, columns, dataSource } = tables;
			const width = getWidth(columns);
			const height = getHeight(title, columns, dataSource);
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext('2d');
			renderBackground(ctx, width, height);
			renderTable(tables, { ctx, width, height });
			return canvas;
		} else {
			const width = tables.reduce((maxWidth, { columns }) => Math.max(getWidth(columns), maxWidth), 0);
			const height = tables.reduce((height, { title, columns, dataSource }) => height + getHeight(title, columns, dataSource), 0) + (tables.length - 1) * spacing;
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
