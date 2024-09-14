document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const addNameBtn = document.getElementById('addNameBtn');
    const searchInput = document.getElementById('searchInput');
    const namesTableBody = document.querySelector('#namesTable tbody');
    const sortIdAsc = document.getElementById('sortIdAsc');
    const sortIdDesc = document.getElementById('sortIdDesc');
    const sortNameAsc = document.getElementById('sortNameAsc');
    const sortNameDesc = document.getElementById('sortNameDesc');
    const noteArea = document.getElementById('noteArea');
    const noteInputArea = document.getElementById('noteInputArea');
    const saveNoteBtn = document.getElementById('saveNoteBtn');

    let names = JSON.parse(localStorage.getItem('names')) || [];
    updateTable(names);

    addNameBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            const id = names.length ? names[names.length - 1].id + 1 : 1;
            names.push({ id, name, note: '' });
            localStorage.setItem('names', JSON.stringify(names));
            updateTable(names);
            nameInput.value = '';
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredNames = names.filter(nameObj => nameObj.name.toLowerCase().includes(query));
        updateTable(filteredNames);
    });

    sortIdAsc.addEventListener('click', () => {
        const sortedNames = [...names].sort((a, b) => a.id - b.id);
        updateTable(sortedNames);
    });

    sortIdDesc.addEventListener('click', () => {
        const sortedNames = [...names].sort((a, b) => b.id - a.id);
        updateTable(sortedNames);
    });

    sortNameAsc.addEventListener('click', () => {
        const sortedNames = [...names].sort((a, b) => a.name.localeCompare(b.name));
        updateTable(sortedNames);
    });

    sortNameDesc.addEventListener('click', () => {
        const sortedNames = [...names].sort((a, b) => b.name.localeCompare(a.name));
        updateTable(sortedNames);
    });

    function updateTable(data) {
        namesTableBody.innerHTML = '';
        data.forEach(nameObj => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nameObj.id}</td>
                <td>${nameObj.name}</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${nameObj.id}">Editar</button>
                    <button class="note-btn" data-id="${nameObj.id}">Adicionar Nota</button>
                    <button class="delete-btn" data-id="${nameObj.id}">Excluir</button>
                </td>
            `;
            namesTableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const nameObj = names.find(name => name.id === id);
                if (nameObj) {
                    showModal(nameObj);
                }
            });
        });

        document.querySelectorAll('.note-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const nameObj = names.find(name => name.id === id);
                if (nameObj) {
                    noteInputArea.dataset.id = id;
                    noteInputArea.value = nameObj.note || '';
                    noteArea.style.display = 'block';
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                names = names.filter(name => name.id !== id);
                localStorage.setItem('names', JSON.stringify(names));
                updateTable(names);
            });
        });
    }

    saveNoteBtn.addEventListener('click', () => {
        const id = parseInt(noteInputArea.dataset.id);
        const note = noteInputArea.value.trim();
        const nameObj = names.find(name => name.id === id);
        if (nameObj) {
            nameObj.note = note;
            localStorage.setItem('names', JSON.stringify(names));
            updateTable(names);
            noteInputArea.value = '';
            noteArea.style.display = 'none';
        }
    });

    function showModal(nameObj) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Editar Nome</h2>
                <p>Nome: ${nameObj.name}</p>
                <textarea id="noteInput">${nameObj.note}</textarea>
                <button id="saveBtn">Salvar</button>
                <button class="cancel">Cancelar</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('saveBtn').addEventListener('click', () => {
            const note = document.getElementById('noteInput').value.trim();
            nameObj.note = note;
            localStorage.setItem('names', JSON.stringify(names));
            updateTable(names);
            document.body.removeChild(modal);
        });

        document.querySelector('.cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
});
