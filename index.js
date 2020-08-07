class Builder {

	constructor(modules, baseurl = window.location.pathname) {
		this.modules = []
		this.baseurl = baseurl
		this.modules.push(modules)
	}

	get list() {
		return this.modules
	}

	moduleError(type, module) {
		switch(type) {
			case 'type':
				throw("error: module expected to be string " + typeof module + " received")
				break
			default:
				throw('error: something went wrong')
		}
	}

	add(modules) {
		if (modules instanceof Array) {
			for (let i = 0; i < modules.length; i++) {
				if (typeof modules[i] !== 'string') this.moduleError('type', modules[i])
				this.modules.push(modules[i])
			}
			return
		}
		if (typeof modules !== 'string') this.moduleError('type', modules)
		this.modules.push(modules)
	}

	remove(modules) {
		this.modules = this.modules.filter(m => {
			if (modules instanceof Array) {
				for (let i = 0; i < modules.length; i++) {
					if (typeof modules[i] !== 'string') this.moduleError('type', modules[i])
					return m !== modules[i]
				}
			} 	
			if (typeof modules !== 'string') this.moduleError('type', modules)
			return m !== modules
		})
	}

	onlyUse(modules) {
		this.reset()
		this.modules.push(modules)
	}

	reset() {
		this.modules = []
	}

	register() {
		const body = document.getElementsByTagName("body").item(0)
		for (let i = 0; i < this.modules.length; i++) {
			const script = document.createElement('script')
			script.setAttribute('src', [[this.modules[i], 'js'].join('.')].join('/'))
			body.appendChild(script)
		}
	}

}
