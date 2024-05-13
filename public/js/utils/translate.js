function translate (text) {
    if (text == 'interviews') return 'Entrevistas';
    if (text == 'reviews') return 'Análises';
    if (text == 'stories') return 'Histórias';
    if (text == 'tips') return 'Dicas';
    if (text == 'trends') return 'Tendências';

    if (text == 'posted') return 'Postado';
    if (text == 'draft') return 'Rascunho';

    if (text == 'active') return 'Ativo';
    if (text == 'pending') return 'Pendente';
    if (text == 'banned') return 'Suspenso';
    if (text == 'deleted') return 'Deletado';

    if (text == 'admin') return 'Administrador';
    if (text == 'editor') return 'Editor';
    if (text == 'user') return 'Usuário';

    return text; // Se não for nenhum dos anteriores
}

export { translate };