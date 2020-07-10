# table-renderer

> convert table or spreadsheet data into an image

## Background

When I build a slack slash command, I wanted to format the command results look like table. However, I could not find a simple way to do that, and decided to build a table-like view using code. I struggled to format the code like table, but the layout was broken in small window. In addition, the text layout was broken with CJK character. So I decided to build the report with image.

Someone who wants to build a simple spreadsheet data into an image, this module will help.

## Install

```bash
npm install table-renderer
```

## Usage

```javascript
import path from 'path';
import TableRenderer, { saveImage } from 'table-renderer';

const renderTable = TableRenderer().render;

const canvas = renderTable({
	title: 'Marketing Summary',
	columns: [
		{ width: 200, title: 'Campaign', dataIndex: 'campaign' },
		{ width: 100, title: 'Install', dataIndex: 'install', align: 'right' },
		{ width: 100, title: 'Cost', dataIndex: 'cost', align: 'right' },
	],
	dataSource: [
		'-',
		{ campaign: 'Google CPC', install: '12', cost: '$ 400' },
		{ campaign: 'Facebook CPC', install: '3', cost: '$ 60' },
		{ campaign: 'Youtube Video', install: '131', cost: '$ 1,230' },
		'-',
		{ campaign: 'Total', install: '146', cost: '$ 1,690' },
	],
});

saveImage(canvas, path.join(__dirname, 'example.png'));
```

## API

-   TableImage()
-   TableImage#render()
-   saveImage()

### TableImage

```javascript
TableImage({ cellWidth: number, cellHeight: number, offsetLeft: number, offsetTop: number, spacing: number }) => { render: function };
```

### TableImage#render

```javascript
render((tables: Object | Array)) => Canvas;
```

tables parameter is either Object or Array. Single table is comprised of title, columns, and dataSource, where title is optional. Parameters of render function resembles ant-design Table paramters.

The function returns Canvas object, which is an instance of node-canvas. So, you can add canvas operations to it.

```javascript
render({
    title: 'Marketing Summary',
    columns: [...],
    dataSource: [...]
});
```

### saveImage

```javascript
saveImage((canvas: Canvas), (filepath: String)) => Promise;
```

![table-renderer](example.png)
