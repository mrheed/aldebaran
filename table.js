class TableBuilder {

	constructor(target, data) {
		this.id = [target, (new Date).getTime()].join("_")
		this.target = target
		this.rowCount = data.rowData.length
		this.currentIndex = 0
		this.columnData = data.columnData
		this.rowData = data.rowData
		this.offset = !!data.offset ? data.offset : 0
		this.table = null
	}
	
	get getRowData() {
		return this.rowData
	}
	get getRowCount() {
		return this.rowCount
	}
	get getColumnData() {
		return this.columnData
	}

	nextIndex() {
		
	}

	previousIndex() {

	}

	last() {

	}

	first() {

	}

	destroy() {
		const targetElm = document.getElementById(this.target)	
		targetElem.removeChild(this.table)
	}	

	store() {
		if (!window.Repository.exist("table")) 
				throw("error: table repository not found, please create new repository")
		window.Repository.register(this, "table")
	}
	
	call() {
		if (!window.Repository.exist("table")) 
				throw("error: table repository not found, please create new repository")
		window.Repository.pull(this.id, "table").build()
	}


	createHeadRows(parentElement) {
		const node = document.createElement("th")
		const row = document.createElement("tr")
		parentElement.appendChild(row)
		for (let i = 0; i < this.columnData.length; i++) {
			const th = node.cloneNode(false)
			th.innerHTML = this.columnData[i]
			row.appendChild(th)
		}
	}

	createRowCells(parentElement) {
		const node = document.createElement("td")
		for (let i = 0; i < this.columnData.length; i++) {
			const td = node.cloneNode(false)
			td.innerHTML = this.rowData[this.columnData[i]]
			parentElement.appendChild(td)
		}
	}

	createBodyRows(parentElement) {
		const node = document.createElement("tr")
		for (let i = 0; i < this.rowData.length; i++) {
			const tr = node.cloneNode(false)
			this.createRowCells(tr)
			parentElement.appendChild(tr)
		}
	}

	build() {
		const targetElm = document.getElementById(this.target)	
		const tableContainer = document.createElement('table')
		const tableHeader = document.createElement('thead')
		const tableBody = document.createElement('tbody')
		this.createHeadRows(tableHeader)
		this.createBodyRows(tableBody)
		tableContainer.setAttribute("border", "1")
		tableContainer.appendChild(tableHeader)
		tableContainer.appendChild(tableBody)
		this.table = tableContainer
		targetElm.appendChild(tableContainer)
	}
}
