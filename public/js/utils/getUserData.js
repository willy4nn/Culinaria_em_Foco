// Função que obtém os dados do usuário
export default function getUserData() {
    return fetch('/api/login/profile/')
        .then((response) => {
            if (!response.ok) {
                return response.json().then(errorResponse => {
                    throw errorResponse;
                });
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error('Erro:', error);
            throw error;
        });
}