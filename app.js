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
            domObj: null
        }
        
        const listItem = this.renderListItem(dino)
        const table = document.querySelector('tbody')
        //table.appendChild(listItem)
        //TODO: Add the dino to this.dinos
        this.dinos.push(dino)
        this.renderList()
        ++ this.max
    },

    renderListItem(dino) {
        const tableRow = document.createElement('tr')
        tableRow.id = 'id-' + dino.id
        const htmlContent = `
            <td>${dino.name}</td>
            <td><button class="button success" type="button" onclick="app.star('${dino.id}')">Favorite</button></td>
            <td><button class="button" type="button" onclick="app.moveUp('${dino.id}')">Up</button></td>
            <td><button class="button" type="button" onclick="app.moveDown('${dino.id}')">Down</button></td>
            <td><button class="button alert" type="button" onclick="app.deleteDino('${dino.id}')">Delete</button></td>
        `
        tableRow.innerHTML = htmlContent
        dino.domObj = tableRow
        return tableRow
    },

    renderList() {
        const table = document.querySelector('tbody')
        table.innerHTML = ""
        for(var i=0;i<this.dinos.length;i++) {
            const dino = this.dinos[i];
            const item = this.renderListItem(dino)
            table.appendChild(item)
        }
    },

    moveUp(id) {
        
    },

    moveDown(id) {

    },

    star(id) {

    },

    deleteDino(id) {
        console.log("delett")
        this.dinos.splice(this.dinos.indexOf(this.getDinoByID(id)),1)
        this.renderList()
    },
    
    getDinoByID(id) {
        for(var i=0;i<this.dinos.length;i++) {
            const dino = this.dinos[i]
            if(parseInt(dino.id) === id) {
                return dino
            }
        }
    }
}

app.init({
    formSelector: '#dino-form', 
    listSelector: '#dino-list',
})