# CV REVIEWER WITH RAG (Retrieval Augmented Generation)

Make sure to provide `.env` file:

```bash
cp .env.example .env
```

Fill the `.env` file with yours

You need to install `chromadb`
```bash
pip install chromadb
```

Run `chromadb` : 
```bash
chroma run --path ./db --port 8000
```

Run the training step:

```bash
bun run setup.ts
```

Then run the server:

```bash
bun run index.ts
```

Open http://localhost:5173 in your browser
