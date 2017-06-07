const app = {
    init(formSelector) {
        document
            .querySelector(formSelector)
            .addEventListener('submit', this.addDino)
        
    },

    addDino(event) {
        event.preventDefault()
        const dinoName = event.target.dinoName.value
        console.log(dinoName)
    },
}

app.init('#dino-form')