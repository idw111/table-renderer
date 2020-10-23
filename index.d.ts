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
	backgroundColor  ?: string | CanvasGradient | CanvasPattern;
}

export type Column = '|' | {
	width?: number,
	title: string,
	dataIndex: string,
};

export type Row = '-' | {
	[key: string]: string,
};

export interface TitleStyle {
	font     ?: string;
	fillStyle?: string | CanvasGradient | CanvasPattern;
	textAlign?: CanvasTextAlign;
	offsetTop?: number;
}

export interface Table {
	title     ?: string;
	titleStyle?: TitleStyle;
	columns    : Column[];
	dataSource : Row[];
	align     ?: CanvasTextAlign;
}

export type RenderFunction = (tables: Table | Table[]) => Canvas;

declare function TableRenderer (options?: TableRendererOptions): { render: RenderFunction };
declare function saveImage (canvas: Canvas, filepath: string): Promise<void>;

export default TableRenderer;
export { saveImage };
