# Admin <img src="/web/public/icon.png" align="right" width="150" />

![package-json-nuxt](https://img.shields.io/github/package-json/dependency-version/cyan-store/Admin/fastify) ![last-commit](https://img.shields.io/github/last-commit/cyan-store/Admin) ![repo-size](https://img.shields.io/github/repo-size/cyan-store/Admin)

The admin panel to cyan-store. Ensure `@cyan-store/Assets` is running and configured in `.env` for complete functionality. This is the API for the admin panel. The web interface can be found in `/web`.

### Install

Follow instructions in [web/README.md](web/README.md) to setup the panel web interface.

```sh
$ npm i
$ cp .env.example .env
$ nano .env # or any editor...
```

### Production/Development

```sh
$ npm run build # Production
$ npm run dev # Development
```

### Lint/Format

```sh
$ npm run lint
$ npm run format
```

## License

[MIT](LICENSE)
