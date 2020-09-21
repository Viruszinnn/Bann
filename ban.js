const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs')
const db = require('quick.db')

exports.run = async (client, message, argumentos) => {
    
    if(!fs.existsSync(`./database/ban/${message.author.id}.txt`)) {
        fs.writeFileSync(`./database/ban/${message.author.id}.txt`);        
    }

    let usuario = message.mentions.users.first();
    let member = message.guild.member(message.mentions.users.first() || client.users.get(argumentos[0]));
    if(!message.guild.member(message.author.id).hasPermissions("BAN_MEMBERS")) return message.reply("Você não tem permissão para usar esse comando.")
    if(!member) return message.reply("***Quem tá fodido? K***")
    if(!message.guild.member(member).bannable) return message.reply("Eu não posso banir essa pessoa.")
    let reason = argumentos.slice(2).join(" ") || "Motivo não informado"
    const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

    let ban = fs.readFileSync(`./database/ban/${message.author.id}.txt`,).toString().split('undefined');

    var embed = new Discord.RichEmbed()
    .setTitle(`${message.author.username} | Ban`)
    .setColor("#05f4f7")
    .setTimestamp()
    .addField("``Staff:`` " , message.author, true)
    .addField("``Membro Banido:`` " , member.user, true)
    .addField("``ID Banido:`` " , member.id, true)
    .setThumbnail(message.author.displayAvatarURL)
    .addField("``Motivo:`` " , reason, true)
    .setImage(`${ban[0]}`)
    if (member.bot) return 0;
    let contadorr = await db.fetch("Bans." + message.author.id)
    if (contadorr === null) contadorr = 1;
    let dmEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL)
    .setDescription(`<:bannn:717462457337118761> Você foi banido | Sapeka` )
    .addField(`<:info:717464446557093931> | Autor do Banimento:\n `, `<:user:717464472460984413> **Tag:** ${message.author.tag}\n <:id:717464496607854663> **ID:** ${message.author.id}` , true)
    .addField("<:id:717464496607854663> | Servidor:", message.guild,  true )
    .addField("<:motivo:717465104945250306> | Motivo", argumentos.slice(2).join(' ') || "Motivo não informado")
    .setThumbnail(message.guild.iconURL ? `${message.guild.iconURL}?size=2048` : "https://i.imgur.com/q23Xd3h.png")
    .setImage(`${ban[0]}`)
    .setColor("BLACK")
    .setFooter(`${message.author.tag} ja baniu ${contadorr} usuario`)
    .setTimestamp();
    member.send(dmEmbed);
    await delay(100);
    if (db.get("Bans." + message.author.id) == 0) {
      db.set("Bans." + message.author.id, 1);
      message.channel.send(dmEmbed).then( m => m.delete(10000));
      member.ban().catch(err => console.log(`Erro: ${err.message}`))
    }else {
      db.add("Bans." + message.author.id, 1);
      message.channel.send(dmEmbed).then( m => m.delete(10000));
     member.ban().catch(err => console.log(`Erro: ${err.message}`))
    }
    message.delete()
}
exports.help = {
    name: "ban"
}
