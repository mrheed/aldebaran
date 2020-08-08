/*
 * Library Name	: Aldebaranjs
 * Author 			: MrSyhd
 * Github 			: https://github.com/syahidnurrohim/aldebaran
 * License			: 
 *
 */

const Aldebaran = (function(e) {
	/**
	 * Raise, throw an exception with optional condition
	 * 
	 * @param string, boolean
	 * @return void
	 */
	function raise(error_message, condition = true) {
		if (condition) throw(error_message)
	}
	/**
	 * Each, just iterate through the data (it could be a number, object,  array)
	 *  
	 * @param array || number || object, function
	 * @return void
	 */
	function each(data, cb){
		var bound = 0
		var object_keys = []
		var no_second_arg = false
		switch(true) {
			case data instanceof Array:
				bound = data.length
				break
			case data instanceof Object:
				object_keys = Object.keys(data)
				bound = object_keys.length
				break
			case Number.isInteger(data):
				bound = data
				no_second_arg = true
				break
			default:
				raise("error: data must be an array, number or integer")
		}
		for (let i = 0; i < bound; i++) {
			if (no_second_arg) {
				cb(i)
			} else if (object_keys.length) {
				cb(object_keys[i], data[object_keys[i]])
			} else {
				cb(i, data[i])
			}
		}
	}

	/**
	 * Merge, just like Object.assign function but instead of replacing the object within the initial object
	 * it will iterate through the object and make recursive action, hence every initial object will be matched 
	 * to the new object no matter how deep the object is
	 *
	 * @param object, object
	 * @return void
	 */
	function merge(o1, o2) {
		const o1keys = Object.keys(o1)
		const o2keys = Object.keys(o2)
		each(o2keys, function(i, d){
			const o1data = o1[d]
			const o2data = o2[d]
			if ((typeof o2data === 'object' && typeof o1data === 'object') && o1data !== null) {
				merge(o1data, o2data)
			} else {
				o1[d] = o2data
			}
		})
	}
	return {
		raise: raise,
		each: each,
		merge: merge,
		/**
		 * Format, assigning variable into a string without placing the variable within,
		 * the variable will be replaced by the parentheses within the string 
		 * and it will be ordered by the index of the variable and parentheses
		 * 
		 * @param string, ...string
		 * @return string
		 */
		format: function(str, ...vars) {
			raise("error: index out of bound", vars.length !== str.split("{}").length-1)
			each(vars, function(i, d) {
				const index_of_p = str.indexOf("{}")
				const before = str.substring(0, index_of_p)
				const after = str.substring(index_of_p + 2)
				str = before + d + after
			})
			return str
		},
		/**
		 * Get Cookies, receive any stored cookie in the document
		 *
		 * @return 
		 */
		get_cookies: function() {
			const c = document.cookie
			const arr_c = c.split("; ")
			const obj = {}
			return arr_c.filter(d => !!d).map((d, i) => {
				const spr = d.split("=")
				if (i = 0) {
					const s = spr[0].split(" ");
					s.shift()
					s.join(" ");
					s[0] = s
				}
				return {[spr[0]]: spr[1]}
			})
		},
		/**
		 * Get Cookie, receive a stored cookie in the document
		 *
		 * @param string
		 * @return string
		 */
		get_cookie: function(c_name) {
			const c = document.cookie
			const arr_c = c.split("; ")
			return arr_c.map(d => d.split(c_name+"=")[1])[0]
		},
		/**
		 * Fetch, HTTP request like XMLHttpRequest with simple usage
		 *
		 * @param object
		 * @return promise
		 */
		fetch: function(o) {
			options = {
				method: 'GET',
				url: "",
				headers: {},
				body: null,
				withCredentials: false,
				onProgress: function(e) {},
				onSuccess: function(response) {},
				onFail: function(response) {},
				onDone: function(response) {},
				onHeaderReceived: function(headers, header) {},
				onPrepareConnection: function() {},
				onConnectionOpen: function() {},
				onTimeout: function() {}
			}
			merge(options, o)
			return new Promise(function(resolve, reject) {
				const xhr = new XMLHttpRequest
				xhr.open(options.method, options.url, true)
				each(options.headers, function(k, v) {
					xhr.setRequestHeader(k, v)
				})
				xhr.onreadystatechange = function() {
					switch(xhr.readyState) {
						case 0:
							options.onPrepareConnection()
							break
						case 1:
							options.onConnectionOpen()
							break
						case 2:
							const headers = xhr.getAllResponseHeaders()
							options.onHeaderReceived(headers, xhr.getResponseHeader)
							break
						case 4:
							const response = {
								type: xhr.responseType,
								text: xhr.responseText,
								status: xhr.status,
								data: xhr.response
							}
							if (xhr.status >= 200 && xhr.status <= 300) {
								options.onSuccess(response)
							} else {
								options.onFail(response)
							}
							options.onDone(response)
							resolve(response)
							break
						default:
							break
					}
				}
				xhr.onprogress = function(e) {
					options.onProgress(e)
				}
				xhr.ontimeout = function() {
					options.onTimeout()
				}
				xhr.onerror = function() {
					reject("an error occured during the transaction")
				}
				const data = new FormData
				each(options.body, function(k, v) {
					data.append(k, v)
				})
				xhr.send(data)
				return xhr
			})
		},
		/**
		 * Get, DOM Element selector with the base syntax of document.getelement
		 * the element selected will be processed to add additional object prototype
		 *
		 * @param string, string
		 * @return Element
		 */
		get: function(filter_name, by_what, forge = true) {
			function process(el) {
				if (el instanceof HTMLCollection || el instanceof NodeList) {
					each(el, function(i, d) {
						process(d)
					})
				} else {
					merge(el, {
						w: el.getBoundingClientRect().width,
						h: el.getBoundingClientRect().height,
						xpos: el.getBoundingClientRect().x,
						ypos: el.getBoundingClientRect().y,
						left: el.getBoundingClientRect().left,
						right: el.getBoundingClientRect().right,
						top: el.getBoundingClientRect().top,
						bottom: el.getBoundingClientRect().bottom,
						onclick: function(cb) {
							el.addEventListener("click", function(e) {
								(cb) && cb(e)
							})
						},
						onstylechange: function(cb) {
							var observer = new MutationObserver(cb)
							var config = {
								attributes: true,
								attributeOldValue: true,
								atributeFilter: ['style']
							}
							observer.observe(el, config)
							return observer
						},
						css: function(property) {
							merge(el.style, property)
							return this
						},
						addclass: function(classname) {
							if (classname instanceof Array) {
								each(classname, function(i, d) {
									this.addclass(d)
								})
							}
							el.classList.add(classname)
							return this
						},
						delclass: function(classname) {
							if (classname instanceof Array) {
								each(classname, function(i, d) {
									this.delclass(d)
								})
							}
							el.classList.remove(classname)
							return this
						},
					})
				}
				return el
			}
			switch(by_what) {
				case 'ID':
					el =  document.getElementById(filter_name)
					return forge ? process(el) : el
				case 'CLASS':
					el =  document.getElementsByClassName(filter_name)
					return forge ? process(el) : el
				case 'TAG':
					el =  document.getElementsByTagName(filter_name)
					return forge ? process(el) : el
				case 'NAME':
					el =  document.getElementsByName(filter_name)
					return forge ? process(el) : el
				default:
					raise(this.format("error: unknown selector {}", by_what))
			}
		},
		/**
		 * Uploader, transmitting file from client to server through HTTP request
		 * the file will be stored as blob data
		 *
		 * @param Element, object
		 * @return void
		 */
		uploader: function(element, options) {
			this.element = element
			this.options = {
				url: "",
				concurrent: {
					enabled: false,
					size: 2
				},
				chunk: {
					enabled: false,
					size: 2000000
				},
				onStart: function() {},
				onProgress: function(data) {},
				onDone: function() {},
				onCancel: function() {},
				onFileChange: function(data) {},
				afterFirstRequest: function(data) {},
				additional_headers: {},
				additional_data: {},
			}
			this._listenFileChange = function() {
				this.element.addEventListener("change", e => {
					this.options.onFileChange(e)
				})
			}
			this._getFileByIdx = function(index) { 
				return this.element.files[index] 
			}
			this._makeSplittedChunkData = function(offset, endBytes) { 
				return this._getFileByIdx(0).slice(offset, endBytes)
			}
			this._getChunkData = function() {
				const file = this._getFileByIdx(0)
				const data = {total_chunk: this.options.chunk.enabled ? Math.ceil(file.size/this.options.chunk.size) : 1}
				const arrDot = file.name.split(".")
				merge(data, {size: file.size, type: file.type, format: arrDot[arrDot.length-1], name: file.name})
				return data
			}
			this.makeUploadRequest = function() {
				const Uploader = this
				const fileSize = Uploader._getChunkData().size
				const fileName = Uploader._getChunkData().name
				const chunking = Uploader.options.chunk.enabled
				const chunkSize = Uploader.options.chunk.size
				const totalChunk = Uploader._getChunkData().total_chunk
				const concurrent = Uploader.options.concurrent.enabled 
				var concurrentSize = Uploader.options.concurrent.size
				var currentChunkIdx = 1
				var offset = 0 
				var endOffset = chunkSize
				const prepareAnythingThenUpload = function(startBytes, endBytes) {
					const blob = Uploader._makeSplittedChunkData(startBytes, endBytes)
					const headers = {
						"Accept": "application/json",
						"Cache-Control": "no-cache",
						"X-Requested-With": "XMLHttpRequest"
					}
					endBytes = chunking ? (endOffset >= fileSize ? offset + fileSize - offset : endBytes) : fileSize
					requestData = {
						file: blob,
						filename: fileName,
						start: startBytes,
						end: endBytes,
						index: currentChunkIdx,
						size: fileSize,
						concurrent: concurrent
					}
					merge(headers, Uploader.options.additional_headers)
					merge(requestData, Uploader._getChunkData())
					merge(requestData, Uploader.options.additional_data)
					offset += chunkSize
					endOffset += chunkSize
					currentChunkIdx++
					Uploader.fetch({
						method: "POST",
						url: Uploader.options.url,
						body: requestData,
						headers: headers,
						onConenctionOpen: function() {
							Uploader.options.onStart()
						},
						onDone: function(response) {
							const progress = parseInt((currentChunkIdx / totalChunk) * 100)
							Uploader.options.onProgress({response: response, progress: progress})
							if (endOffset - chunkSize > fileSize || !chunking) {
								(currentChunkIdx === 0) && Uploader.options.afterFirstRequest(response)
								Uploader.options.onDone()
								return
							}
							prepareAnythingThenUpload(offset, endOffset)
						}
					})
				}
				concurrentSize = concurrentSize > totalChunk ? totalChunk : concurrentSize
				Uploader.options.onStart()
				each((concurrent && chunking ? concurrentSize : 1), function(i) {
					prepareAnythingThenUpload(offset, endOffset)
				})
			}
			merge(this, Aldebaran)
			merge(this.options, options)
			this._listenFileChange()
		}
	}
})(window)
