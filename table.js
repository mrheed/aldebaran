class TableBuilder {

	constructor(target, data) {
		this.id = [target, (new Date).getTime()].join("_")
		this.target = target
		this.rowCount = 0
		this.currentIndex = 0
		this.columnData = data.columnData
		this.rowData = data.rowData
		this.offset = data.offset
	}
	
	get rowData() {
		return this.rowData
	}
	get rowCount() {
		return this.rowCount
	}
	get column() {
		return this.column
	}

	nextIndex() {
		
	}

	previousIndex() {

	}

	last() {

	}

	first() {

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
		for (let i = 0; i < this.columnData.length) {
			const th = node.cloneNode(false)
			th.
			parentElement.appendChild(th)
		}
	}

	build() {
		const targetElm = document.getElementById(this.target)	
		const tableContainer = document.createElement('table')
		const tableHeader = document.createElement('thead')
		const tableBody = document.createElement('tbody')
	}
}
