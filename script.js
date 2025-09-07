// Aguarda o DOM ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS INICIAIS E CONFIGURAÇÃO ---

    const initialPlayers = [
        // ... (seu JSON de jogadoras aqui) ...
        { "id": 1, "nome": "Andressa Alves", "posicao": "Meio-campo", "clube": "Corinthians", "foto": "https://via.placeholder.com/300x200?text=Andressa+Alves", "gols": 15, "assistencias": 10, "jogos": 28, "favorita": false },
        { "id": 2, "nome": "Dayana Rodríguez", "posicao": "Meio-campo", "clube": "Corinthians", "foto": "https://via.placeholder.com/300x200?text=Dayana+Rodriguez", "gols": 5, "assistencias": 12, "jogos": 30, "favorita": false },
        { "id": 3, "nome": "Mariza", "posicao": "Zagueira", "clube": "Corinthians", "foto": "https://via.placeholder.com/300x200?text=Mariza", "gols": 2, "assistencias": 1, "jogos": 32, "favorita": false },
        { "id": 4, "nome": "Thaís Regina", "posicao": "Zagueira", "clube": "Corinthians", "foto": "https://via.placeholder.com/300x200?text=Thais+Regina", "gols": 1, "assistencias": 2, "jogos": 25, "favorita": false },
        { "id": 5, "nome": "Letícia Teles", "posicao": "Zagueira", "clube": "Corinthians", "foto": "https://via.placeholder.com/300x200?text=Leticia+Teles", "gols": 0, "assistencias": 0, "jogos": 18, "favorita": false }
    ];

    // Função para obter jogadoras do LocalStorage
    const getPlayersFromStorage = () => {
        const players = localStorage.getItem('jogadoras');
        return players ? JSON.parse(players) : null;
    };

    // Função para salvar jogadoras no LocalStorage
    const savePlayersToStorage = (players) => {
        localStorage.setItem('jogadoras', JSON.stringify(players));
    };

    // Carrega os dados iniciais se for a primeira vez
    const initializeData = () => {
        if (!getPlayersFromStorage()) {
            savePlayersToStorage(initialPlayers);
        }
    };

    // --- ELEMENTOS DO DOM ---

    const cardsContainer = document.getElementById('cards-container');
    const modal = document.getElementById('playerModal');
    const addPlayerBtn = document.getElementById('addPlayerBtn');
    const closeModalBtn = document.querySelector('.close-button');
    const playerForm = document.getElementById('playerForm');
    const modalTitle = document.getElementById('modalTitle');

    // --- FUNÇÕES DO CRUD ---

    /**
     * READ: Renderiza os cards das jogadoras na tela
     */
    const renderPlayers = () => {
        const players = getPlayersFromStorage();
        cardsContainer.innerHTML = ''; // Limpa o container antes de renderizar

        if (players) {
            players.forEach(player => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <i class="ph ph-star favorite-icon ${player.favorita ? 'favorited' : ''}" data-id="${player.id}"></i>
                    <img src="${player.foto}" alt="Foto de ${player.nome}">
                    <div class="card-info">
                        <h2>${player.nome}</h2>
                        <p><strong>Posição:</strong> ${player.posicao}</p>
                        <p><strong>Clube:</strong> ${player.clube}</p>
                        <ul class="card-stats">
                            <li>Gols: ${player.gols}</li>
                            <li>Assistências: ${player.assistencias}</li>
                            <li>Jogos: ${player.jogos}</li>
                        </ul>
                    </div>
                    <div class="card-actions">
                        <button class="action-btn edit-btn" data-id="${player.id}">Editar</button>
                        <button class="action-btn delete-btn" data-id="${player.id}">Excluir</button>
                    </div>
                `;
                cardsContainer.appendChild(card);
            });
        }
    };

    /**
     * CREATE / UPDATE: Adiciona ou edita uma jogadora
     */
    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('playerId').value;
        const players = getPlayersFromStorage();

        const newPlayerData = {
            nome: document.getElementById('nome').value,
            posicao: document.getElementById('posicao').value,
            clube: document.getElementById('clube').value,
            foto: document.getElementById('foto').value,
            gols: parseInt(document.getElementById('gols').value),
            assistencias: parseInt(document.getElementById('assistencias').value),
            jogos: parseInt(document.getElementById('jogos').value),
            favorita: false // Padrão para novas jogadoras
        };

        if (id) { // Modo Edição
            const playerIndex = players.findIndex(p => p.id == id);
            newPlayerData.id = parseInt(id);
            newPlayerData.favorita = players[playerIndex].favorita; // Mantém o status de favorita
            players[playerIndex] = newPlayerData;
            alert('Jogadora editada com sucesso!');
        } else { // Modo Criação
            newPlayerData.id = new Date().getTime(); // Gera um ID único simples
            players.push(newPlayerData);
            alert('Jogadora adicionada com sucesso!');
        }

        savePlayersToStorage(players);
        renderPlayers();
        closeModal();
    });

    /**
     * DELETE: Exclui uma jogadora
     */
    const deletePlayer = (id) => {
        let players = getPlayersFromStorage();
        players = players.filter(player => player.id != id);
        savePlayersToStorage(players);
        alert('Jogadora removida com sucesso!');
        renderPlayers();
    };
    
    /**
     * FAVORITE: Alterna o status de favorita
     */
    const toggleFavorite = (id) => {
        let players = getPlayersFromStorage();
        const playerIndex = players.findIndex(p => p.id == id);
        if (playerIndex > -1) {
            players[playerIndex].favorita = !players[playerIndex].favorita;
            savePlayersToStorage(players);
            renderPlayers();
        }
    };

    // --- CONTROLE DO MODAL ---

    const openModal = (player = null) => {
        playerForm.reset();
        if (player) { // Modo Edição
            modalTitle.textContent = 'Editar Jogadora';
            document.getElementById('playerId').value = player.id;
            document.getElementById('nome').value = player.nome;
            document.getElementById('posicao').value = player.posicao;
            document.getElementById('clube').value = player.clube;
            document.getElementById('foto').value = player.foto;
            document.getElementById('gols').value = player.gols;
            document.getElementById('assistencias').value = player.assistencias;
            document.getElementById('jogos').value = player.jogos;
        } else { // Modo Adicionar
            modalTitle.textContent = 'Adicionar Nova Jogadora';
            document.getElementById('playerId').value = '';
        }
        modal.style.display = 'block';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };
    
    // --- EVENT LISTENERS ---
    
    addPlayerBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // Delegação de eventos para os botões nos cards
    cardsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.getAttribute('data-id');

        if (target.classList.contains('edit-btn')) {
            const players = getPlayersFromStorage();
            const playerToEdit = players.find(p => p.id == id);
            openModal(playerToEdit);
        }

        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja excluir esta jogadora?')) {
                deletePlayer(id);
            }
        }
        
        if (target.classList.contains('favorite-icon')) {
            toggleFavorite(id);
        }
    });


    // --- INICIALIZAÇÃO ---
    initializeData();
    renderPlayers();
});