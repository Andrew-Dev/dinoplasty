const app = {

    init(selectors) {
        this.max = 0
        this.dinos = []
        this.list = document.querySelector(selectors.listSelector)
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addDino.bind(this))
        
    },

    addDino(event) {
        event.preventDefault()
        const dino = {
            id: this.max + 1,
            name: event.target.dinoName.value,
        }
        
        const listItem = this.renderListItem(dino)
        this.list.appendChild(listItem)

        //TODO: Add the dino to this.dinos

        ++ this.max
    },

    renderListItem(dino) {
        const item = document.createElement('li')
        item.textContent = dino.name
        return item
    },

    moveUp(id) {

    },

    moveDown(id) {

    },

    star(id) {

    },

    delete(id) {

    },
}

app.init({
    formSelector: '#dino-form', 
    listSelector: '#dino-list',
})