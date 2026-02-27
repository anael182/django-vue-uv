# django-vue-uv

Monorepo **Django (API)** + **Vue 3 (Vite) + Vuetify**.

- **Backend** : Django + Django REST Framework + django-cors-headers
- **Frontend** : Vue 3 + Vite + Vuetify
- **Python deps** : `uv`
- **Node deps** : `yarn`
- **DB** : SQLite locale **non commitée**

---

## Prérequis

- Python 3.12+ (ou compatible avec ton projet)
- `uv`
- Node.js (LTS recommandé)
- Yarn (v1+)

Vérifier :

```bash
python3 --version
uv --version
node -v
yarn -v
```

## Installation

### Dépendances Python (backend)

```bash
uv sync
```

### Dépendances Node (frontend)

```bash
cd frontend
yarn install
```

### Variables d'environnement

Creer frontend/.env

```text
VITE_API_URL=http://localhost:8000
```

### Initialisation BDD

```bash
cd backend
uv run python manage.py migrate
```

En cas de changement des modèles :

```bash
cd backend
uv run python manage.py makemigrations
uv run python manage.py migrate
```

### Lancer le projet

Depuis la racine :

```bash
yarn start
```

Cela lancera le backend et le frontend simultanément.

### Lint / Format

```bash
yarn lint
```
