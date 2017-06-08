const app = {

    init(selectors) {
        this.max = -1
        this.dinos = {}
        this.dinoIds = []
        this.table = document.querySelector(selectors.listSelector)
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

        this.dinos[dino.id] = dino
        this.dinoIds.push(dino.id)
        this.table.appendChild(this.renderListItem(dino))

        ++ this.max
    },

    renderListItem(dino) {
        const tableRow = document.createElement('tr')
        console.log(dino)
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

    moveDown(id) {
        const dinoRow = document.querySelector('#id-' + id)
        const rowBelow = dinoRow.nextSibling
        //this.deleteDino(id)
        console.log(dinoRow)
        console.log(rowBelow)
        const tempHTML = dinoRow.innerHTML
        const tempID = dinoRow.id
        dinoRow.innerHTML = rowBelow.innerHTML
        dinoRow.id = rowBelow.id
        rowBelow.innerHTML = tempHTML
        rowBelow.id = tempID
    },

    moveUp(id) {
        const dinoRow = document.querySelector('#id-' + id)
        const rowAbove = dinoRow.previousSibling
        //this.deleteDino(id)
        console.log(dinoRow)
        console.log(rowAbove)
        const tempHTML = dinoRow.innerHTML
        const tempID = dinoRow.id
        dinoRow.innerHTML = rowAbove.innerHTML
        dinoRow.id = rowAbove.id
        rowAbove.innerHTML = tempHTML
        rowAbove.id = tempID
    },

    star(id) {

    },

    deleteDino(id) {
        delete this.dinos[id]
        this.dinoIds.splice(this.dinoIds.indexOf(id),1)
        const dinoRow = document.querySelector(`#id-${id}`)
        dinoRow.parentNode.removeChild(dinoRow);
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
    listSelector: 'tbody',
})