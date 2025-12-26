# Integrating With HubSpot I – Foundations Practicum

This project demonstrates integrating a Node.js + Express app with HubSpot CRM.

## Features
- Connects to HubSpot using a Private App token
- Fetches Contacts via HubSpot CRM API
- Uses a Custom Object (Games)
- Displays custom object records using Pug templates

## Custom Object
Games object contains:
- Name
- Publisher
- Price

## HubSpot Object Link
https://app.hubspot.com/contacts/50825796/objects/2-54742785/views/all/list

## Run Locally
```bash
npm install
node index.js
