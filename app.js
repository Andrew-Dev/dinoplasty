class App {

    constructor(selectors) {
        this.max = -1
        this.dinos = {}

        this.dinoIds = []
        this.herbivoreIds = []
        this.carnivoreIds = []
        this.omnivoreIds = []

        this.table = document.querySelector('#allTable')
        this.hTable = document.querySelector('#hTable')
        this.cTable = document.querySelector('#cTable')
        this.oTable = document.querySelector('#oTable')

        this.form = document.querySelector(selectors.formSelector)
        this.template = document.querySelector(selectors.templateSelector)

        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addDinoFromForm.bind(this))
            
        if(window.localStorage.getItem('ids') != null) {
            this.dinoIds = JSON.parse(window.localStorage.getItem('ids'))
            this.herbivoreIds = JSON.parse(window.localStorage.getItem('hIds'))
            this.carnivoreIds = JSON.parse(window.localStorage.getItem('cIds'))
            this.omnivoreIds = JSON.parse(window.localStorage.getItem('oIds'))
            this.dinos = JSON.parse(window.localStorage.getItem('dinos'))
            this.max = parseInt(window.localStorage.getItem('max'))
        }

        if(this.dinoIds.length > 0) {
            for(let i=0;i<this.dinoIds.length;i++) {
                console.log(i)
                const id = this.dinoIds[i]
                this.table.appendChild(this.renderListItem(this.dinos[id],true))
            }
            for(let i=0;i<this.herbivoreIds.length;i++) {
                console.log(i)
                const id = this.herbivoreIds[i]
                this.hTable.appendChild(this.renderListItem(this.dinos[id]))
            }
            for(let i=0;i<this.carnivoreIds.length;i++) {
                console.log(i)
                const id = this.carnivoreIds[i]
                this.cTable.appendChild(this.renderListItem(this.dinos[id]))
            }
            for(let i=0;i<this.omnivoreIds.length;i++) {
                console.log(i)
                const id = this.omnivoreIds[i]
                this.oTable.appendChild(this.renderListItem(this.dinos[id]))
            }
        }
    }

    addDinoFromForm(event) {
        event.preventDefault()
        const dino = {
            id: this.max + 1,
            name: event.target.dinoName.value,
            type: event.target.dinoType.value,
            favorite: '',
        }
        
        const listItem = this.renderListItem(dino,true)

        this.dinos[dino.id] = dino
        this.dinoIds.unshift(dino.id)
        this.table.insertBefore(listItem, this.table.firstChild)

        this.addBasedOnType(dino)

        this.form.dinoName.value = null

        ++ this.max
        
        localStorage.setItem('dinos',JSON.stringify(this.dinos))
        this.saveAllIds()
        localStorage.setItem('max',this.max.toString())
    }

    addBasedOnType(dino) {
        const listItem = this.renderListItem(dino)
        if(dino.type === 'Carnivore') {
            this.cTable.insertBefore(listItem, this.cTable.firstChild)
            this.carnivoreIds.unshift(dino.id)
        } else if(dino.type === 'Herbivore') {
            this.hTable.insertBefore(listItem, this.hTable.firstChild)
            this.herbivoreIds.unshift(dino.id)
        } else {
            this.oTable.insertBefore(listItem, this.oTable.firstChild)
            this.omnivoreIds.unshift(dino.id)
        }
    }

    renderListItem(dino,useAll) {
        const tableRow = this.template.cloneNode(true) //document.createElement('tr')
        if(this.template.parentNode != null) {
            this.template.parentNode.removeChild(this.template)
        }
        let tableId = dino.type
        if(useAll === true) {
            tableId = 'all'
        }
        console.log(dino)
        tableRow.id = 'id-' + dino.type + '-' + dino.id
        tableRow.dataset.id = dino.id
        console.log("renderlistitem id",dino.id)
        tableRow.setAttribute('class',dino.favorite)

        const htmlContent = `
                <td><strong><span data-id="${dino.id}" contenteditable="true">${dino.name}</span></strong><br>${dino.type}</td>
                <td><span class="vbtn"><button class="button warning" type="button" onclick="app.star('${dino.id}')"><i class="fa fa-heart-o" aria-hidden="true"></i></button></span></td>
                <td><span class="vbtn"><button class="button" type="button" onclick="app.moveUp('${dino.id}','${tableId}')"><i class="fa fa-arrow-up" aria-hidden="true"></i></button></span></td>
                <td><span class="vbtn"><button class="button" type="button" onclick="app.moveDown('${dino.id}','${tableId}')"><i class="fa fa-arrow-down" aria-hidden="true"></i></button></span></td>
                <td><span class="vbtn"><button class="button alert" type="button" onclick="app.deleteDino(${dino.id})"><i class="fa fa-trash-o" aria-hidden="true"></i></button></span></td>
        `
        tableRow.innerHTML = htmlContent
        dino.domObj = tableRow
        tableRow.addEventListener('keypress', (event) => {
            if(event.key === 'Enter') {
                event.preventDefault()
                event.target.blur()
            }
        });
        tableRow.addEventListener('input', (event) => {
            const rowDino = this.dinos[parseInt(event.target.dataset.id)]
            rowDino.name = event.target.textContent
            localStorage.setItem('dinos',JSON.stringify(this.dinos))
        })
        return tableRow
    }

    moveDown(id,tableId) {
        const dino = this.dinos[id]
        let dinoRow = document.querySelector('#id-' + tableId + '-' + id)
        if(tableId === 'all') {
            dinoRow = document.querySelector('tr[data-id="' + id + '"]')
        }
        console.log(dinoRow)
        const rowBelow = dinoRow.nextSibling
        const dinoBelow = this.dinos[parseInt(rowBelow.dataset.id)]
        console.log("row below")
        console.log(rowBelow)
        if(!rowBelow) {
            return
        }
        //this.deleteDino(id)
        console.log(dinoRow)
        console.log(rowBelow)
        const tempHTML = dinoRow.innerHTML
        const tempID = dinoRow.id
        dinoRow.innerHTML = rowBelow.innerHTML
        dinoRow.id = rowBelow.id
        dinoRow.setAttribute('class',dinoBelow.favorite)
        rowBelow.innerHTML = tempHTML
        rowBelow.id = tempID
        rowBelow.setAttribute('class',dino.favorite)
        
        if(tableId === 'Carnivore') {
            this.updateIDsList(tableId,this.cTable)
        } else if(tableId === 'Herbivore') {
            this.updateIDsList(tableId,this.hTable)
        } else if(tableId === 'Omnivore') {
            this.updateIDsList(tableId,this.oTable)
        } else if(tableId === 'all') {
            this.updateIDsList(tableId,this.table)
        }
    }

    moveUp(id,tableId) {
        console.log("moveup tableid",tableId)
        const dino = this.dinos[id]
        console.log(id)
        console.log("dino")
        console.log(dino)
        let dinoRow = document.querySelector('#id-' + tableId + '-' + id)
        if(tableId === 'all') {
            dinoRow = document.querySelector('tr[data-id="' + id + '"]')
        }
        console.log(dinoRow)
        const rowAbove = dinoRow.previousSibling
        console.log(rowAbove)
        if(!rowAbove) {
            return
        }
        const dinoAbove = this.dinos[parseInt(rowAbove.dataset.id)]
        console.log("dino above",dinoAbove)
        //this.deleteDino(id)
        console.log(dinoRow)
        console.log(rowAbove)
        const tempHTML = dinoRow.innerHTML
        const tempID = dinoRow.id
        dinoRow.innerHTML = rowAbove.innerHTML
        dinoRow.id = rowAbove.id
        dinoRow.setAttribute('class',dinoAbove.favorite)
        const tempDatasetId = dinoRow.dataset.id
        dinoRow.dataset.id = rowAbove.dataset.id
        rowAbove.innerHTML = tempHTML
        rowAbove.id = tempID
        rowAbove.dataset.id = tempDatasetId
        rowAbove.setAttribute('class',dino.favorite)
        
        if(tableId === 'Carnivore') {
            this.updateIDsList(tableId,this.cTable)
        } else if(tableId === 'Herbivore') {
            this.updateIDsList(tableId,this.hTable)
        } else if(tableId === 'Omnivore') {
            this.updateIDsList(tableId,this.oTable)
        } else if(tableId === 'all') {
            this.updateIDsList(tableId,this.table)
        }
    }

    star(id) {
        const dinoRows = document.querySelectorAll('tr[data-id="' + id + '"]')
        dinoRows.forEach((dinoRow) => {
            const dinoClass = dinoRow.getAttribute('class')
            if(dinoClass.includes('star')) {
                dinoRow.setAttribute('class',dinoClass.replace('star',''))
                this.dinos[id].favorite = ''
            } else {
                dinoRow.setAttribute('class',dinoClass + ' star')
                this.dinos[id].favorite = 'star'
            }
        })
        localStorage.setItem('dinos',JSON.stringify(this.dinos))
    }

    deleteDino(id) {
        console.log("delete id",id)
        const dino = this.dinos[id]
        delete this.dinos[id]
        this.dinoIds.splice(this.dinoIds.indexOf(id),1)
        if(dino.type === 'Carnivore') {
            this.carnivoreIds.splice(this.carnivoreIds.indexOf(id),1)
            const dinoRow = document.querySelector('#id-' + dino.type + '-' + id)
            dinoRow.parentNode.removeChild(dinoRow)
            this.updateIDsList(dino.type,this.cTable)
        } else if(dino.type === 'Herbivore') {
            this.herbivoreIds.splice(this.herbivoreIds.indexOf(id),1)
            const dinoRow = document.querySelector('#id-' + dino.type + '-' + id)
            dinoRow.parentNode.removeChild(dinoRow)
            this.updateIDsList(dino.type,this.cTable)
        } else {
            this.omnivoreIds.splice(this.omnivoreIds.indexOf(id),1)
            const dinoRow = document.querySelector('#id-' + dino.type + '-' + id)
            dinoRow.parentNode.removeChild(dinoRow)
            this.updateIDsList(dino.type,this.oTable)
        }
        const dinoRow = document.querySelector('tr[data-id="' + id + '"]')
        dinoRow.parentNode.removeChild(dinoRow)
        localStorage.setItem('dinos',JSON.stringify(this.dinos))
        this.updateIDsList(this.dinoIds,this.table)
    }
    
    saveAllIds() {
        localStorage.setItem('ids',JSON.stringify(this.dinoIds))
        localStorage.setItem('cIds',JSON.stringify(this.carnivoreIds))
        localStorage.setItem('hIds',JSON.stringify(this.herbivoreIds))
        localStorage.setItem('oIds',JSON.stringify(this.omnivoreIds))
    }

    getDinoByID(id) {
        for(let i=0;i<this.dinos.length;i++) {
            const dino = this.dinos[i]
            if(parseInt(dino.id) === id) {
                return dino
            }
        }
    }

    updateIDsList(tableId,table) {
        let newIds = []
        console.log("chuldNodes",table.childNodes)

        for(let i=1;i<table.childNodes.length;i++) {
            
            console.log("child")
            const child = table.childNodes[i]
            if(child.id == undefined) {
                continue
            }
            console.log(child)
            console.log("child id",child.dataset.id)
            
            const idStr = child.dataset.id
            const id = parseInt(idStr)
            newIds.push(id)
        }
        
        if(tableId === 'Carnivore') {
            this.carnivoreIds = newIds
        } else if(tableId === 'Herbivore') {
            this.herbivoreIds = newIds
        } else if(tableId === 'Omnivore') {
            this.omnivoreIds = newIds
        } else if(tableId === 'all') {
            this.dinoIds = newIds
        }

        console.log("newIds",newIds)
        this.saveAllIds()
    }

    getDinoIDsByType(type) {
        let ids = []
        this.dinos.forEach((dino) => {
            if(dino.type === type) {
                ids.push(dino.id)
            }
        })
    }
}

const app = new App({
    formSelector: '#dino-form', 
    listSelector: 'tbody',
    templateSelector: '.dino.template'
})