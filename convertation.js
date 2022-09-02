import 'dotenv/config'
import { isJidUser, jidDecode } from "@adiwajshing/baileys"
import axios from "axios"

const host = process.env.SERVER_HOST || 'localhost'

// const isSecure = process.env.secure_host || false
// let protocol = isSecure ? 'true' : 'false';

const server = `http://${host}`

const convertation = async (wa, messages) => {
    let id = messages.key.remoteJid
    let message = messages.message.conversation.toLowerCase()
    let messageArr = message.split(" ")

    // await wa.sendMessage(id, { text: messageArr.length })
    if (messageArr.length <= 2) {
        await wa.sendPresenceUpdate('composing', id)
        if (messageArr[0] == 'menu') {
            await wa.sendMessage(id, { text: Menu() })
        } else if (messageArr[0] == 'status') {
            await wa.sendMessage(id, { text: await cekStatus(id) })
        } else if (messageArr[0] == 'detail') {
            await wa.sendMessage(id, { text: await detail(message) })

        } else if (messageArr[0] == 'operasional') {
            await wa.sendMessage(id, { text: operasional() })

        } else {
            await wa.sendMessage(id, { text: 'Perintah tidak ditemukan. ketik *MENU* untuk meilhat perintah yang tersedia.' })
        }

    } else {
        await wa.sendPresenceUpdate('composing', id)
        await wa.sendMessage(id, { text: 'Perintah tidak ditemukan. ketik *MENU* untuk meilhat perintah yang tersedia.' })
    }
}

const Menu = () => {
    let text

    // text = `*MENU*\n\n`
    text = `Silahkan ketik perintah sesuai yang anda butuhkan : \n\n`
    text += `*1. Status*\n`
    text += `   - _Melihat status pengerjaan._\n`
    text += `*2. Detail*\n`
    text += `   - _Melihat detail tanda terima barang._\n`
    // text += `*3. Kartu ttb*\n`
    // text += `   - _Gambar kartu tanda terima barang._\n`
    text += `*3. Operasinal*\n`
    text += `   - _Detail jam operasional toko._\n\n`
    text += `-------------------------------------------------\n`
    text += `_Info Lebih lanjut Hub :_\n`
    text += `📞 08116407788`

    return text

}

const cekStatus = async (id) => {
    let text = ''

    let jid = jidDecode(id).user

    let response = await axios.post(`${server}/api/status`, {
        id: jid
    });

    let status = response.data.status_code
    let data = response.data.data


    if (status == 200) {

        let da = ''
        data.receipts.map((value) => {
            da += `- No. Register : ${value.receipt_code}\n  ( Status : ${value.status} )\n`
        })
        text += `Hallo *${data.name}*, berikut informasi status pengerjaan tanda terima anda :\n\n`
        text += `${da}`
        text += `\n`
        text += `-------------------------------------------------\n`
        text += `_Info Lebih lanjut Hub :_\n`
        text += ` 08116407788`
    } else if (status == 400) {
        text += `Maaf, data tanda terima tidak ditemukan...`
    }

    return text

}

const detail = async (message) => {
    let messageArr = message.split(" ");
    let text;

    if (messageArr.length < 2) {
        return text = `Format pesan salah. No. Register tidak ada.\nCth: _detail <spasi> 20990292-02_`;
    }

    let response = await axios.post(`${server}/api/detail`, {
        receipt_code: messageArr[1]
    });

    if (response.data.status_code == 200) {
        text = response.data.data
    } else {
        text = 'No. Register tidak ditemukan. Coba dengan No. yang lain.'
    }

    return text
}

const operasional = () => {
    let text;

    text = '*JAM OPERASIONAL VENETA SM RAJA*\n\n'
    text += '🕘 Senin  : 09.00 s/d 18.00\n'
    text += '🕘 Selasa : 09.00 s/d 18.00\n'
    text += '🕘 Rabu   : 09.00 s/d 18.00\n'
    text += '🕘 Kamis  : 09.00 s/d 18.00\n'
    text += '🕘 Jum\'at : 09.00 s/d 18.00\n'
    text += '🕘 Sabtu  : 09.00 s/d 13.00\n'
    text += '🕘 Minggu : 09.00 s/d 13.00\n\n'
    text += `-------------------------------------------------\n`
    text += `_Info Lebih lanjut Hub :_\n`
    text += ` 08116407788`

    return text
}

export default convertation