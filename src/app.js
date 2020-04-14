const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  //Verifica se a ID é valida
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.' });
  }

  const validateId = repositories.findIndex((r) => r.id === id);

  //Verifica se exite um repositório com a ID informada
  if (validateId === -1) {
    return response.status(404).json({ error: 'Repository ID not found.' });
  }

  //Adiciona a ID do repositório ao request para ser utilizada nos métodos
  request.repositoryIndex = validateId;

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { title, url, techs } = request.body;
  const { repositoryIndex } = request;

  //Apenas altera se a propriedade existir
  if (title) repositories[repositoryIndex].title = title;
  if (url) repositories[repositoryIndex].url = url;
  if (techs) repositories[repositoryIndex].techs = techs;

  return response.json(repositories[repositoryIndex]);
});

app.delete('/repositories/:id', (request, response) => {
  const { repositoryIndex } = request;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { repositoryIndex } = request;

  repositories[repositoryIndex].likes++;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
