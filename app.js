const app = {

    init(selectors) {
        this.max = -1
        this.dinos = {}
        this.dinoIds = []
        this.table = document.querySelector(selectors.listSelector)
        this.form = document.querySelector(selectors.formSelector)
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addDino.bind(this))
        
        if(window.localStorage.getItem('ids') != null) {
            this.dinoIds = JSON.parse(window.localStorage.getItem('ids'))
            this.dinos = JSON.parse(window.localStorage.getItem('dinos'))
            this.max = parseInt(window.localStorage.getItem('max'))
        }

        if(this.dinoIds.length > 0) {
            for(let i=0;i<this.dinoIds.length;i++) {
                console.log(i)
                const id = this.dinoIds[i]
                this.table.appendChild(this.renderListItem(this.dinos[id]))
            }
        }
    },

    addDino(event) {
        event.preventDefault()
        const dino = {
            id: this.max + 1,
            name: event.target.dinoName.value,
            favorite: '',
        }
        
        const listItem = this.renderListItem(dino)

        this.dinos[dino.id] = dino
        this.dinoIds.push(dino.id)
        this.table.appendChild(this.renderListItem(dino))

        this.form.dinoName.value = null

        ++ this.max

        localStorage.setItem('dinos',JSON.stringify(this.dinos))
        localStorage.setItem('ids',JSON.stringify(this.dinoIds))
        localStorage.setItem('max',this.max.toString())
    },

    renderListItem(dino) {
        const tableRow = document.createElement('tr')
        console.log(dino)
        tableRow.id = 'id-' + dino.id
        tableRow.setAttribute('class',dino.favorite)
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
        this.updateIDsList()
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
        this.updateIDsList()
    },

    star(id) {
        const dinoRow = document.querySelector('#id-' + id)
        const dinoClass = dinoRow.getAttribute('class')
        if(dinoClass.includes('star')) {
            dinoRow.setAttribute('class',dinoClass.replace('star',''))
            this.dinos[id].favorite = ''
        } else {
            dinoRow.setAttribute('class',dinoClass + ' star')
            this.dinos[id].favorite = 'star'
        }
        localStorage.setItem('dinos',JSON.stringify(this.dinos))
    },

    deleteDino(id) {
        delete this.dinos[id]
        this.dinoIds.splice(this.dinoIds.indexOf(id),1)
        const dinoRow = document.querySelector(`#id-${id}`)
        dinoRow.parentNode.removeChild(dinoRow)
        this.updateIDsList()
    },
    
    getDinoByID(id) {
        for(let i=0;i<this.dinos.length;i++) {
            const dino = this.dinos[i]
            if(parseInt(dino.id) === id) {
                return dino
            }
        }
    },

    updateIDsList() {
        let newIds = []
        for(let i=1;i<this.table.childNodes.length;i++) {
            const child = this.table.childNodes[i]
            console.log("child")
            console.log(child)
            const idStr = child.id.replace('id-','')
            const id = parseInt(idStr)
            newIds.push(id)
        }
        this.dinoIds = newIds
        localStorage.setItem('ids',JSON.stringify(this.dinoIds))
    }
}

app.init({
    formSelector: '#dino-form', 
    listSelector: 'tbody',
})