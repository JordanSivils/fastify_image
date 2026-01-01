import { buildApp } from "./app";

const app = buildApp();

app.listen({ port: 3030}).catch(err => {
    app.log.error(err)
    process.exit(1)
})