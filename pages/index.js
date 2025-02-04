import React from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }}/>
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}


function ProfileRelationsBox (propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        ({propriedades.title}) ({propriedades.items.length})
      </h2>
      <ul>
            {/* {seguidores.map((itemAtual) => {
              return (
                <li key={itemAtual}>
                  <a href={`https://github.com/${itemAtual}.png`}>
                    <img src={itemAtual.image} />
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              )
            })} */}
      </ul>
    </ProfileRelationsBoxWrapper> 
  )
}

export default function Home() {
  const usuarioAleatorio = 'omariosouto';
  const [comunidades, setComunidades] = React.useState([])
  //const comunidades = comunidades[0]
  //const alteradorDeComunidades/setComunidades = comunidades[1]
  const githubUser = 'nogueirawell'
  // const comunidades = ['Alurakut']
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = React.useState([]) 

  React.useEffect(function(){
    // 0 Pegar o array de dados do github
    // GET
    fetch('https://api.github.com/users/peas/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function(repostaCompleta) {
        setSeguidores(repostaCompleta)
      })

      // API GraphQL
      fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Authorization': '842bee08764e86c7fd372f38ea3b18',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ "query": `query {
          allCommunities{
            title
            id
            imageUrl
            creatorSlug
          }
        }`})
      })
      .then((response) => response.json()) //Pega o retorno do response.json() e já retorna
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities
        console.log(comunidadesVindasDoDato)
        setComunidades(comunidadesVindasDoDato)
      })
  }, [])  
  // 1 - Criar um box que vai ter um map, baseado nos items do array que pegamos do Github

  return (
    <>
      <AlurakutMenu />
      <MainGrid>

      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
        {/* <Box style="grid-area: profileArea;"> */}
        <ProfileSidebar githubUser={githubUser}/>
      </div>

      <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
        <Box>
          <h1 className="title">
            Bem vindo(a)

            <OrkutNostalgicIconSet />
          </h1>
        </Box>

        <Box>
          <h2 className="subtitle">O que você deseja fazer?</h2>
          <form onSubmit={function handleCriaComunidade(e) {
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);

            const comunidade = {
              title: dadosDoForm.get('title'),
              imageUrl: dadosDoForm.get('image'),
              creatorSlug: usuarioAleatorio,           
            }

            fetch('/api/comunidades', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(comunidade)
            })
            .then(async (response) => {
              const dados = await response.json()
              console.log(dados.registroCriado)
              const comunidade = dados.registroCriado
              
              const comunidadesAtualizadas = [...comunidades, comunidade]
              setComunidades(comunidadesAtualizadas)
            })
          }}>
            <div>
              <input
                placeholder="Qual vai ser o nome da sua comunidade?"
                name="title"
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
            </div>
            <div>
              <input
                placeholder="Coloque uma URL para usarmos de capa"
                name="image"
                aria-label="Coloque uma URL para usarmos de capa"
              />
            </div>

            <button>
              Criar comunidade
            </button>
          </form>
        </Box>
      </div>

      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

      <ProfileRelationsBox title="Seguidores" items={seguidores} />    

      <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
          Comunidades ({comunidades.length})
      </h2>
      <ul>
            {comunidades.map((itemAtual) => {
              return (
                <li key={itemAtual.id}>
                  <a href={`/communities/${itemAtual.id}`}>
                    <img src={itemAtual.imageUrl} />
                    <span>{itemAtual.title}</span>
                  </a>
                </li>
              )
            })}
      </ul>
      </ProfileRelationsBoxWrapper>

      <ProfileRelationsBoxWrapper> 
        <h2 className="smallTitle">
          Pessoas da Comunidade ({pessoasFavoritas.length})
        </h2>
        <ul>
            {pessoasFavoritas.map((itemAtual) => {
              return (
                <li key={itemAtual}>
                  <a href={`/users/${itemAtual}`}>
                    <img src={`https://github.com/${itemAtual}.png`} />
                    <span>{itemAtual}</span>
                  </a>
                </li>
              )
            })}
         </ul>
      </ProfileRelationsBoxWrapper>
      </div>
        
      </MainGrid>
    </>
  )
}
