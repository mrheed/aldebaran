class Builder {

	constructor(modules, assets_url = window.location.pathname) {
		this.primaryModules = ["repository", "dom"]
		this.modules = ["aldebaran", "table"]
		this.assets_url = assets_url 
		modules && this.modules.push(modules)
	}

	/**
	 * List, get existing module
	 * @return Array
	 */
	get list() {
		return [this.modules, this.primaryModules].flat()
	}

	/**
	 * ModuleError, throw error module
	 * @param string, string
	 * @return error
	 */
	moduleError(type, module) {
		switch(type) {
			case 'type':
				throw("error: module expected to be string " + typeof module + " received")
				break
			default:
				throw('error: something went wrong')
		}
	}

	/**
	 * Add, insert module to module list
	 * @param string | Array
	 * @return void
	 */
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

	/**
	 * Remove, delete specified module
	 * @param string | Array
	 * @return void
	 */
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

	/**
	 * OnlyUse, change module list to given modules in parameter
	 * @param string | Array
	 * @return instance
	 */
	onlyUse(modules) {
		this.reset()
		this.modules.push(modules)
		return this
	}

	/**
	 * Reset, empty entire module list
	 * @return void
	 */
	reset() {
		this.modules = []
	}

	/**
	 * Register, call modules to HTML DOM
	 * @return void
	 */
	register(type = "optional") {
		const body = document.getElementsByTagName("body").item(0)
		var modules = type === "primary" ? this.primaryModules : this.modules
		for (let i = 0; i < modules.length; i++) {
			const script = document.createElement('script')
			script.setAttribute('src', [[modules[i], 'js'].join('.')].join('/'))
			body.appendChild(script)
		}
	}

}

window.onloadstart = function() {
	window.ModuleBuilder = new Builder()
	window.ModuleBuilder.register("primary")
}()
