function Blocker(selector) {
    let self = {};
    self.selector = selector;
    self.element = document.querySelector(self.selector)
    self.showAction = (replacement) => replacement.dispatchEvent(self.showEvent);
    self.showEvent = new CustomEvent('blockerjsShowEvent')

    self.hide = function(showEvent){
        // need custom event to trigger showing
        let replacement = document.createElement("div")
        replacement.id = self.element.id
        replacement.style = self.element.style
        replacement.addEventListener(showEvent, (event) => {
            replacement.parentElement.replaceChild(self.element, replacement)
        })
        self.element.parentElement.replaceChild(replacement, self.element)
        return self
    }

    self.block = function(color="none", triggerEvent="click"){
        const width = self.element.offsetWidth
        const height = self.element.offsetHeight
        let replacement = document.createElement("div")
        replacement.id = self.element.id
        replacement.style = self.element.style + `;min-height: ${height}px; min-width: ${width}px; background-color: ${color};`
        replacement.addEventListener(triggerEvent, (event) => {
            self.showAction(replacement)
        })
        replacement.addEventListener('blockerjsShowEvent', (event) => {
            replacement.parentElement.replaceChild(self.element, replacement)
        })
        self.element.parentElement.replaceChild(replacement, self.element)
        return self

    }

    self.blur = function(blurStrength, triggerEvent="click"){
        const width = self.element.offsetWidth
        const height = self.element.offsetHeight
        let replacement = self.element.cloneNode(true);
        replacement.style = self.element.style + `; -webkit-filter: blur(${blurStrength}px);
                                                    -moz-filter: blur(${blurStrength}px);
                                                    -o-filter: blur(${blurStrength}px);
                                                    -ms-filter: blur(${blurStrength});filter: blur(${blurStrength}px);`
        replacement.addEventListener(triggerEvent, (event) => {
            self.showAction(replacement)
        })
        replacement.addEventListener('blockerjsShowEvent', (event) => {
            replacement.parentElement.replaceChild(self.element, replacement)
        })
        self.element.parentElement.replaceChild(replacement, self.element)
        return self
    }

    self.setShowAction = function(config){
        if (config.mode === "password"){
            self.showAction = (replacement) => {
                if (replacement.parentElement.querySelectorAll(":scope > .passwordShowActionContainer").length === 0){
                    let cont = document.createElement("div")
                    let btn = document.createElement("button")
                    let inpt = document.createElement("input")
                    cont.className = "passwordShowActionContainer"
                    const repPos = replacement.getBoundingClientRect()
                    cont.style = `; position: absolute; left:${repPos.x + repPos.width/2}px;
                                    top:${repPos.y + repPos.height/2}px; transform: translate(-50%, -50%);
                                    max-width: ${repPos.width}; max-height: ${repPos.height}`
                    btn.innerHTML = "confirm"
                    cont.appendChild(inpt)
                    cont.appendChild(btn)
                    inpt.placeholder = "enter the password"
                    const checkVal = (event) => {
                        if (inpt.value == config.password){
                            replacement.dispatchEvent(self.showEvent)
                            cont.parentElement.removeChild(cont)
                        }
                    }
                    btn.onclick = checkVal
                    replacement.parentElement.appendChild(cont) 
                }
            }
        }
        return self
    }



    return self
}