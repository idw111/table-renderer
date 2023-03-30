# table-renderer

> convert table or spreadsheet data into an image

## Background

One day, I had to build a slack slash command which reports marketing reports to our company slack channel. I wanted to format the command results look like table, but I could not find a simple way to do that. I decided to build a table-like view using markdown text, and struggled to do that. However, the layout was broken with small windows or with CJK charaters. So I decided to build the report as an image.

![table-renderer](example.png)

I hope this module will help someone who wants to convert a simple spreadsheet data into an image,

## Install

```bash
npm install table-renderer canvas
```

[node-canvas](https://github.com/Automattic/node-canvas) module is peer-dependency. You have to install it, too.

## Examples

-   [Single Table](./examples/single-table)
-   [Multiple Tables](./examples/multiple-tables)
-   [Styling Title](./examples/styling-title)
-   [Horizontal and Vertical Lines](./examples/lines)
-   [Horizontal and Vertical Padding](./examples/padding)
-   [Custom Font](./examples/custom-font)

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

## CommonJS
```javascript
const path = require('path');
const TableRenderer = require('table-renderer');
const {saveImage} = TableRenderer;
const renderTable = TableRenderer.default().render;
```

![single table](example.png)

## API

-   [TableRenderer()](#tablerenderer)
-   [TableRenderer#render()](#tablerendererrender)
-   [saveImage()](#saveimage)

### TableRenderer

```javascript
TableRenderer(options = {}) => ({ render: function });
```

#### options

-   `cellWidth` {number} default width for a table cell. default = 100
-   `cellHeight` {number} default height for a table cell. default = 40
-   `offsetLeft` {number} default text offset from left border of table cell. default = 8
-   `offsetTop` {number} default text offset from top border of table cell. default = 26
-   `spacing` {number} spacing between tables. default = 20
-   `titleSpacing` {number} spacing between title and a table. default = 10
-   `fontFamily` {string} default = 'sans-serif'
-   `paddingVertical` {number} vertical padding of a page. default = 0
-   `paddingHorizontal` {number} horizontal padding of a page. default = 0
-   `backgroundColor` {string} page background color. default = '#ffffff'

### TableRenderer#render

```javascript
render((tables: Object | Array)) => Canvas;
```

tables parameter is either Object or Array. Single table is comprised of title, columns, and dataSource, where title is optional. Parameters of render function resembles ant-design Table paramters.

The function returns Canvas object, which is an instance of [node-canvas](https://github.com/Automattic/node-canvas). So, you can add canvas operations to it.

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
