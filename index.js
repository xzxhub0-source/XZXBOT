require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// ==== CONFIGURATION ====
const TOKEN = process.env.TOKEN;        // Bot token from .env or Railway
const GUILD_ID = process.env.GUILD_ID;  // Server ID from .env or Railway
const BOOSTER_ROLE_NAME = 'Booster';    // Role to assign to boosters
const COLOR_INTERVAL = 15000;           // 15 seconds per color change

// Pink → Purple gradient colors
const colors = [
    '#FFC0CB', // light pink
    '#FFB6C1',
    '#FF69B4',
    '#FF1493',
    '#C71585',
    '#8B008B', // dark purple
    '#800080'
];

let colorIndex = 0;

// ==== BOT READY ====
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    // Start cycling role color
    setInterval(async () => {
        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) return;

        const role = guild.roles.cache.find(r => r.name === BOOSTER_ROLE_NAME);
        if (!role) return;

        try {
            await role.setColor(colors[colorIndex]);
            colorIndex = (colorIndex + 1) % colors.length;
        } catch (err) {
            console.error('Error updating role color:', err);
        }
    }, COLOR_INTERVAL);
});

// ==== BOOST DETECTION ====
client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (!oldMember.premiumSince && newMember.premiumSince) {
        const guild = newMember.guild;
        const role = guild.roles.cache.find(r => r.name === BOOSTER_ROLE_NAME);

        if (role) {
            newMember.roles.add(role)
                .then(() => console.log(`${newMember.user.tag} started boosting! Role added.`))
                .catch(console.error);
        }
    }
});

client.login(TOKEN);
