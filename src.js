
const clouds = []
const stars = []
const disposing = []

let screen_velocity = 1
let current_slide = 0

const dispose_element = (element, id, direction) => {

    if (!disposing.includes(element)) {

        disposing.push([element, window.getComputedStyle(element).left, 0, direction, id])
    }
}

const make_cloud = () => {
    
    const cloud_object = document.createElement('div')
    const size = Math.random() * 2

    cloud_object.classList.add('cloud')
    cloud_object.style.width = `${Math.max(20 * size, 20/2)}vh`
    cloud_object.style.height = `${Math.max(15 * size, 15/2)}vh`
    cloud_object.style.top = `${Math.random() * 100}%`
    cloud_object.style.zIndex = -3 + size

    clouds.push([cloud_object, Math.random() * 100, size])
    document.body.appendChild(cloud_object)
}

const make_star = () => {
    
    const star_object = document.createElement('div')
    const size = Math.random() * 2

    star_object.classList.add('star')
    star_object.style.width = `${Math.max(20 * size, 10)}vh`
    star_object.style.height = `${Math.max(20 * size, 10)}vh`

    star_object.style.top = `${Math.random() * 20}%`
    star_object.style.left = `${Math.random() * 100}%`

    star_object.style.zIndex = -10 + size

    stars.push([star_object, Math.random() * 100])
    document.body.appendChild(star_object)
}


const dispose_frame = (id) => {

    if (id == 0) {

        dispose_element(document.getElementById('main_title'), 'main', 1)
        dispose_element(document.getElementById('about_me'), 'about', 1)

    } else if (id == 1) {

        document.getElementById('main_slide').style.visibility = 'visible'
        document.getElementById('about_me').style.visibility = 'hidden'
        document.getElementById('back_avatar').style.visibility = 'hidden'

    } else if (id == 2) {

        dispose_element(document.getElementById('main_title'), 'main', -1)
        dispose_element(document.getElementById('about_me'), 'about', -1)

        document.getElementById('back_avatar').style.visibility = 'hidden'
    } else if (id == 3) {

        document.getElementById('main_slide').style.visibility = 'hidden'
        document.getElementById('about_me').style.visibility = 'visible'
        document.getElementById('back_avatar').style.visibility = 'visible'
    }
}


const set_slide = (new_slide) => {

    for (v of document.getElementsByClassName('slide')) {

        if (v.dataset.slide == new_slide.toString()) {

            v.style.visibility = 'visible'

        } else if (v.dataset.slide == current_slide.toString()) {

            v.style.visibility = 'hidden'
        }
    }

    current_slide = new_slide
}


setInterval(() => {

    if (disposing.length > 0) {

        screen_velocity = 0.3 * -disposing[0][3]

    } else {

        screen_velocity = 0
    }

    for (v of clouds) {

        const cloud_object = v[0]
        const elapsed_time = v[1]
        const horizontal_size = Math.max(20 * v[2], 20/2)

        cloud_object.style.left = `calc(${(((elapsed_time % 100) / 100) * -horizontal_size)}vh + ${100 - (elapsed_time % 100)}vw)`

        v[1] += (0.01 * Math.max(v[2] + 1)) + screen_velocity
    }

    for (v of stars) {

        const star_object = v[0]
        const elapsed_time = v[1]

        star_object.style.transform = `scale(${Math.sin(Math.PI * ((elapsed_time % 100) / 100)) / 5})`

        v[1] += 0.1
    }

    for (v of disposing) {

        v[0].style.left = `calc(${v[1]} + ${v[2]}vw)`
        v[2] += 0.4 * v[3]

        if (v[2] >= 100 && v[3] == 1) {

            const index = disposing.indexOf(v)
            disposing.splice(index, 1)

            if (v[4] == 'about') {

                document.getElementById('back_avatar').style.visibility = 'visible'
            }

        } else if (v[2] <= -100 && v[3] == -1) {

            const index = disposing.indexOf(v)
            disposing.splice(index, 1)
        }
    }

}, 10)

window.onload = function(){

    const sounds = {

        click: new Audio('sounds/click.mp3'),
        back: new Audio('sounds/back.mp3'),
        arrow: new Audio('sounds/arrow.mp3')
    }
    
    {

        for (let i = 1; i <= 15; i++) {

            make_cloud()
        }
    
        for (let i = 1; i <= 30; i++) {
    
            make_star()
        }    
    }

    {

        for (v of document.getElementsByClassName('main_button')) {

            v.addEventListener('click', () => {
    
                sounds.click.play()
            })
        }
    
        for (v of document.getElementsByClassName('ok_button')) {
    
            v.addEventListener('click', () => {
    
                sounds.click.play()
            })
        }

        for (v of document.getElementsByClassName('back_button')) {
    
            v.addEventListener('click', () => {
    
                sounds.back.play()
            })
        }
    }

    {

        for (v of document.getElementsByClassName('arrow_button')) {

            const slide = v.dataset.slide
    
            v.onclick = () => {
    
                set_slide(Number(slide) + 1)
                sounds.arrow.play()
            }
        }
    
        for (v of document.getElementsByClassName('arrow_rev_button')) {
    
            const slide = v.dataset.slide
    
            v.onclick = () => {
    
                set_slide(Number(slide) - 1)
                sounds.arrow.play()
            }
        }
    }
 };