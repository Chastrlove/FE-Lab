const {Server} = require('@tus/server')
const {FileStore} = require('@tus/file-store')

const host = '127.0.0.1'
const port = 1080
const server = new Server({
  path: '/files',
  datastore: new FileStore({directory: './uploads'}),
})

server.listen({host, port})
