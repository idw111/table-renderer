import { Canvas } from 'canvas';

export interface TableRendererOptions {
	cellWidth        ?: number;
	cellHeight       ?: number;
	offsetLeft       ?: number;
	offsetTop        ?: number;
	spacing          ?: number;
	titleSpacing     ?: number;
	fontFamily       ?: string;
	paddingVertical  ?: number;
	paddingHorizontal?: number;
	backgroundColor  ?: string;
}

export type Column = '|' | {
	width?: number,
	title: string,
	dataIndex: string,
};

export type Row = '-' | {
	[key: string]: string,
};

export interface Table {
	title?: string;
	columns: Column[];
	dataSource: Row[];
}

export type RenderFunction = (tables: Table | Table[]) => Canvas;

declare function TableRenderer (options?: TableRendererOptions): { render: RenderFunction };
declare function saveImage (canvas: Canvas, filepath: string): Promise<void>;

export default TableRenderer;
export { saveImage }
