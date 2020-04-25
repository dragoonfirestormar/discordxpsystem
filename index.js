const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs').promises;

const client = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();
let prefix = process.env.PREFIX; 

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if(message.author.bot) return;
	if(message.content.startsWith(prefix)) return;
	if(message.guild === null) return;
	else {
		let xpFile = await fs.readFile('userxp.json', 'utf8');
		let xpWorker = JSON.parse(xpFile);
		if(xpWorker.hasOwnProperty(message.guild.id)){
			let guildWorker = xpWorker[message.guild.id];
			if(guildWorker.hasOwnProperty(message.author.id)){
				let userTracker = guildWorker[message.author.id];
				let currentXp = userTracker['userXP'];
				let gainedXp = Math.round(Math.random()*48);
				let updatedXp = currentXp+gainedXp;
				let currentLvl = userTracker['userLevel'];
				let updatedLvl = Math.floor(updatedXp/1000);
				if(currentLvl != updatedLvl){
					message.channel.send(`GG ${message.member}, you just advanced to level ${updatedLvl}!`);
				}
				xpWorker[message.guild.id][message.author.id]['userXP']=updatedXp;
				xpWorker[message.guild.id][message.author.id]['userLevel']=updatedLvl;
				await fs.writeFile('userxp.json', JSON.stringify(xpWorker,null,4), 'utf8').catch(err=>console.log(err));
			} else {
				xpWorker[message.guild.id][message.author.id]={};
				xpWorker[message.guild.id][message.author.id]['userTag']=message.member.user.tag;
				xpWorker[message.guild.id][message.author.id]['userXP']=Math.round(Math.random()*250);
				xpWorker[message.guild.id][message.author.id]['userLevel']=0;
				await fs.writeFile('userxp.json', JSON.stringify(xpWorker,null,4), 'utf8').catch(err=>console.log(err));
			}
		} else {
			xpWorker[message.guild.id] ={}; 
			xpWorker[message.guild.id]['guildName'] = message.guild.name; 
			xpWorker[message.guild.id]['memberCount'] = message.guild.memberCount;
			await fs.writeFile('userxp.json', JSON.stringify(xpWorker,null,4), 'utf8').catch(err=>console.log(err));
		}
	}
});

client.on('message', async message => {
	if(message.author.bot) return;
	if(message.guild === null) return;
	if(message.content.toLowerCase() === `${prefix}level`){
		let xpFile = await fs.readFile('userxp.json', 'utf8');
		let xpWorker = JSON.parse(xpFile);
		message.channel.send(`${message.member}, your are currently on level ${xpWorker[message.guild.id][message.author.id]['userLevel']}, with ${xpWorker[message.guild.id][message.author.id]['userXP']} XP!`);
	}
	if(message.content.toLowerCase() === `${prefix}list`){
		let xpFile = await fs.readFile('userxp.json', 'utf8');
		let xpWorker = JSON.parse(xpFile);
		let tempHash=[];
		let arr = Object.keys(xpWorker[`${message.guild.id}`]);
		for(let i=2;i<arr.length;i++){
			tempHash[i]=[xpWorker[`${message.guild.id}`][arr[i].toString()]["userXP"],arr[i]];
		}
		tempHash.shift();tempHash.shift();
		tempHash.sort((a,b) => a[0] - b[0]).reverse()
		let tempString="";
		console.log(tempHash);
		if(tempHash.length<10){
			for(let i =1; i<=tempHash.length; i++){
				let num = Math.floor(tempHash[i-1][0]/786);
				tempString=tempString+`\n${i}. ${client.users.cache.get(tempHash[i-1][1]).username} (level ${num})`;
			}
			message.channel.send(`${tempString}`);
		}
		else {
			for(let i =1; i<=10; i++){
				tempString=tempString+`\n${i}. ${client.users.cache.get(tempHash[i-1][1]).username} (level ${num})`;
			}
			message.channel.send(`${tempString}`);
		}
	}
	if(message.content.toLowerCase() === `${prefix}rank`){
		let xpFile = await fs.readFile('userxp.json', 'utf8');
		let xpWorker = JSON.parse(xpFile);
		let tempHash=[];
		let arr = Object.keys(xpWorker[`${message.guild.id}`]);
		for(let i=2;i<arr.length;i++){
			tempHash[i]=[xpWorker[`${message.guild.id}`][arr[i].toString()]["userXP"],arr[i]];
		}
		tempHash.shift();tempHash.shift();
		let key=message.author.id;
		tempHash.sort((a,b) => a[0] - b[0]).reverse();
		for (let i = 0; i < tempHash.length; i++) {
			if(tempHash[i][1]==key){
				message.channel.send(`${message.member}, your rank is #${i+1}!`);
			}
		}
	}
});

client.login(process.env.TOKEN);