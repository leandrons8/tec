layers = JSON.parse(window.sessionStorage.getItem("layers"))
if (!layers){
    layers = []
}

const colors = [
    "#4c72b0",
    "#dd8452",
    "#55a868",
    "#c44e52",
    "#8172b3",
    "#937860",
    "#da8bc3",
    "#8c8c8c",
    "#ccb974",
    "#64b5cd",
]

scale = 1

function renderBody(){
    const body = document.body

    const nav = renderNav()

    const container = document.createElement("div")
    container.className = "container text-center"

    // const row = document.createElement("div")
    // row.className = "row py-3"

    // const col1 = document.createElement("div")
    // col1.className = "col-6"

    const table = document.createElement("table")
    table.className = "table align-middle"

    const thead = document.createElement("thead")

    const trtitle = document.createElement("tr")

    const name = document.createElement("th")
    name.scope = "col"
    name.innerText = "Name"

    const thickness = document.createElement("th")
    thickness.scope = "col"
    thickness.innerText = "Thickness \\( \\left( mm \\right) \\)"

    const id = document.createElement("th")
    id.scope = "col"
    id.innerHTML = "&#8960 Inner \\( \\left( mm \\right) \\)"

    const od = document.createElement("th")
    od.scope = "col"
    od.innerHTML = "&#8960 Outer \\( \\left( mm \\right) \\)"

    const k = document.createElement("th")
    k.scope = "col"
    k.innerHTML = "Thermal Conductivity \\( \\left( W \\over { m \\times K } \\right) \\)"

    const actions = document.createElement("th")
    actions.scope = "col"
    actions.innerHTML = "Actions"

    const tbody = document.createElement("tbody")

    // const col2 = document.createElement("div")
    // col2.className = "col-6 text-center"

    const tec = document.createElement("p")
    tec.className = "text-center fs-1"

    const canvas = document.createElement("canvas")

    body.append(nav, container)
    container.append(table, tec, canvas)
    // container.append(row)
    // row.append(col1, col2)
    // col1.append(table)
    table.append(thead, tbody)
    thead.append(trtitle)
    trtitle.append(name, thickness, id, od, k, actions)
    // col2.append(canvas)
}

function renderNav(){
    const nav = document.createElement("nav")
    nav.className = "navbar sticky-top bg-body-tertiary"

    const navcontainer = document.createElement("div")
    navcontainer.className = "container"

    const navbrand = document.createElement("span")
    navbrand.className = "navbar-brand"
    navbrand.innerText = "TEC - Thermal Exchange Coefficient"

    nav.append(navcontainer)
    navcontainer.append(navbrand)

    return nav
}

function renderTable(){
    const tbodyold = document.getElementsByTagName("tbody")[0]
    const tbodynew = document.createElement("tbody")

    for (let i=0; i<layers.length; i++){
        tbodynew.append(renderTableRow(i))
    }

    tbodynew.append(renderTableRow())

    tbodyold.parentNode.replaceChild(tbodynew, tbodyold)
}

function renderTableRow(i){
    const tr = document.createElement("tr")

    const tdname = document.createElement("td")

    const name = document.createElement("input")
    name.className = "form-control"

    const tdthickness = document.createElement("td")

    const thickness = document.createElement("input")
    thickness.className = "form-control"
    thickness.type = "number"
    thickness.onchange = function (){
        const num = Number(this.value)
        if (num > 0){
            layers[i].thickness = num
            update()
        } else {
            window.alert("Enter a thickness greater than 0")
            layers[i].thickness = 1
            update()
        }
    }

    const tdid = document.createElement("td")

    const id = document.createElement("input")
    id.className = "form-control"
    id.type = "number"

    const tdod = document.createElement("td")

    const od = document.createElement("input")
    od.className = "form-control"
    od.type = "number"
    od.disabled = true

    const tdk = document.createElement("td")

    const k = document.createElement("input")
    k.className = "form-control"
    k.type = "number"
    k.onchange = function (){
        const num = Number(this.value)
        if (num > 0){
            layers[i].k = num
            update()
        } else {
            window.alert("Enter a thermal conductivity greater than 0")
            layers[i].k = 1
            update()
        }
    }

    const tdactions = document.createElement("td")

    const btngroup = document.createElement("div")
    btngroup.className = "btn-group"

    const up = document.createElement("button")
    up.className = "btn btn-secondary"

    const upicon = document.createElement("i")
    upicon.className = "bi bi-arrow-up"

    const down = document.createElement("button")
    down.className = "btn btn-secondary"

    const downicon = document.createElement("div")
    downicon.className = "bi bi-arrow-down"

    const remove = document.createElement("button")
    remove.className = "btn btn-secondary"

    const removeicon = document.createElement("i")
    removeicon.className = "bi bi-x-lg"

    if (i != undefined){
        name.value = layers[i].name
        name.disabled = true

        thickness.value = layers[i].thickness

        id.value = layers[i].id

        od.value = layers[i].od

        k.value = layers[i].k

        up.onclick = function (){
            const layer = layers[i]

            layers.splice(i, 1)
            layers.splice(i-1, 0, layer)

            update()
        }

        down.onclick = function (){
            const layer = layers[i]

            layers.splice(i, 1)
            layers.splice(i+1, 0, layer)

            update()
        }

        remove.onclick = function (){
            layers.splice(i, 1)
            update()
        }
    } else {
        name.onchange = function (){
            if (layers.map(layer => layer.name).includes(this.value)){
                window.alert("Enter a name different from the existing ones")
                this.value = null
            } else if (layers.length){
                layers.push({name: this.value, thickness: 1, k: 1})
                update()
            } else {
                layers.push({name: this.value, thickness: 1, id: 1, k: 1})
                update()
            }
            
        }
        thickness.disabled = true
        k.disabled = true
        up.disabled = true
        down.disabled = true
        remove.disabled = true
    }

    if (i==0){
        id.onchange = function (){
            const num = Number(this.value)
            if (num > 0){
                update(num)
            } else {
                window.alert("Enter a inner diameter greater than 0")
                update(1)
            }
        }

        up.disabled = true
    } else {
        id.disabled = true
    }
    
    if (i==(layers.length-1)){
        down.disabled = true
    }

    tr.append(tdname, tdthickness, tdid, tdod, tdk, tdactions)
    tdname.append(name)
    tdthickness.append(thickness)
    tdid.append(id)
    tdod.append(od)
    tdk.append(k)
    tdactions.append(btngroup)
    btngroup.append(up, down, remove)
    up.append(upicon)
    down.append(downicon)
    remove.append(removeicon)

    return tr
}

function renderCircle(tec){
    const oldcanvas = document.getElementsByTagName("canvas")[0]
    const newcanvas = document.createElement("canvas")
    newcanvas.width = 400
    newcanvas.height = 400
    const ctx = newcanvas.getContext("2d")

    for (let i = layers.length - 1; i >= 0; i--){
        const layer = layers[i]
        ctx.beginPath()
        ctx.arc(200, 200, scale*layer.od/2, 0, 2*Math.PI)
        ctx.fillStyle = colors[i%10]
        ctx.fill()
    }

    if (layers.length){
        ctx.beginPath()
        ctx.arc(200, 200, scale*layers[0].id/2, 0, 2*Math.PI)
        ctx.fillStyle = "#000000"
        ctx.fill()

        // ctx.font = "30px Arial";
        // ctx.textAlign = "center"
        // ctx.textBaseline = "top"
        // ctx.fillStyle = "white"
        // ctx.fillText("TEC = " + tec.toExponential(4), 200, 0)
    }

    oldcanvas.parentNode.replaceChild(newcanvas, oldcanvas)
}

function update(id){
    const tectext = document.getElementsByTagName("p")[0]
    let od = ((id) ? id : Math.min(...layers.map(l => l.id).filter(l => l)))
    let tec = 0
    for (const layer of layers){
        let id = od
        od += 2*layer.thickness
        layer.id = id
        layer.od = od
        tec += Math.log(layer.od/layer.id)/layer.k
    }
    tec = 2*Math.PI/tec
    tec = tec.toExponential(4)
    tec = tec.split("e")
    tec[1] = Number(tec[1])
    tec = tec[0]  + (tec[1] ? "\\times 10^" + tec[1] : "")
    tec = "\\( TEC = " + tec + " { W \\over { m \\times K } } \\)"
    tectext.innerText = tec
    scale = 400/od
    renderTable()
    renderCircle(tec)
    window.sessionStorage.setItem("layers", JSON.stringify(layers))
}

renderBody()
update()
