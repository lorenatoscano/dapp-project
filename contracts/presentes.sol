// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.0;
pragma abicoder v2;

import "./owner.sol"; 

contract GiftsContract is Mortal{

    uint balance = 0;

    //Struct que armazena uma lista criada.
    struct GiftList{
        address ownerAddress;
        string hostsName;
        string eventDate;
        string eventName;
        string message;
        Gift[] gifts;
    }

    //Struct que armazena os dados de um presente
    struct Gift{
        uint256 id;
        uint price;
        string title;
        string imageUrl;
        address gifter;
        bool gifted;
    }

    //Struct feita para facilitar a remoção de uma lista (diminuir uso de gás)
    struct DataGiftList{
        mapping(address => GiftList) lists;
        bool _isDeleted;
    }

    //mapping que armazena um mapping de listas e a informação de sua deleção ou não
    mapping(address => DataGiftList) dataGiftLists;

    //Lista contendo os endereços de dono de listas criadas para poder percorrer o mapping de listas mais facilmente
    address[] listOwnersAddresses;

    event ListUpdated(address listOwner);

    //Modificador que checa se o endereço possui alguma lista
    modifier onlyListOwner(address end){
        require(_onlyListOwner(end), "Sender must be a list owner!");
        _;
    }

    function _onlyListOwner(address _end) public view returns(bool){
        return _end == dataGiftLists[_end].lists[_end].ownerAddress;
    }


    //Função para criar uma nova lista. Caso o endereço que enviou a transação já tenha uma lista, 
    // uma mensagem de erro é retornada
    // @Parametros: hosts (nome dos anfitriões), eventDate (data do evento), 
    // name (nome do evento), description (descrição breve) 
    // @Retorno: true caso gerou lista.
    function createNewList(string memory hosts, string memory eventDate, string memory name, string memory description) public returns(bool){
        require(msg.sender != dataGiftLists[msg.sender].lists[msg.sender].ownerAddress, "The address already has a list!");
        dataGiftLists[msg.sender].lists[msg.sender].ownerAddress = msg.sender;
        dataGiftLists[msg.sender].lists[msg.sender].hostsName = hosts;
        dataGiftLists[msg.sender].lists[msg.sender].eventDate = eventDate;
        dataGiftLists[msg.sender].lists[msg.sender].eventName = name;
        dataGiftLists[msg.sender].lists[msg.sender].message = description;
        listOwnersAddresses.push(msg.sender);
        emit ListUpdated(msg.sender);
        return true;
    } 



    //Função para criar um novo presente. Caso o endereço que enviou a transação não tenha uma lista associada, 
    // uma mensagem de erro é retornada. 
    // Os ultimos dois parametros do construtor são relacionados à quem presenteou, portanto são inicializados como 0 e false.
    // @Parametros: value (valor do presente), name (nome do presente), 
    // imageLink (link para a imagem) 
    // @Retorno: presente gerado.
    function addGift(uint value, string memory name, string memory imageLink) public onlyListOwner(msg.sender) returns (Gift memory){
        //Inicialmente não tem quem presenteou e o boolean "gifted" é setado como false
        uint256 end = hash(value, name, imageLink, msg.sender);
        Gift memory gift = Gift(end, value, name, imageLink, address(0), false);
        dataGiftLists[msg.sender].lists[msg.sender].gifts.push(gift);
        emit ListUpdated(msg.sender);
        return gift;
    }

    //Função para remover um presente da lista. Caso o endereço que enviou a transação não tenha uma lista associada, 
    // uma mensagem de erro é retornada. 
    // Caso o presente já tenha sido presenteado, envia o valor do presente ao remetente.
    // @Parametros: id (id do presente a ser removido, gerado a partir de uma função hash)
    // @Retorno: true caso removeu, false caso contrário.
    function removeGift(uint256 id) public onlyListOwner(msg.sender) returns(bool){
        Gift[] storage gifts = dataGiftLists[msg.sender].lists[msg.sender].gifts;
        for(uint i = 0; i < gifts.length; i++){
            if(gifts[i].id == id){
                if(gifts[i].gifted){
                    msg.sender.transfer(gifts[i].price);
                }
                gifts[i] = gifts[gifts.length - 1];
                gifts.pop();
                emit ListUpdated(msg.sender);
                return true;
            }
        }
        return false;
    }

    //Função para receber o valor de um presente
    // Caso o remetente seja igual ao dono da lista, retorna um erro.
    // Caso não haja nenhuma lista com o endereço, retorna erro.
    // @Parametros: id (id do presente que está sendo dado), listOwner (endereço do dono da lista daquele presente)
    // @Retorno: true caso conseguiu presentear, falso no contrário.
    function toGift(uint256 id, address listOwner) external payable returns (bool) {
        require(listOwner != msg.sender, "You can't gift yourself!");
        require(dataGiftLists[listOwner].lists[listOwner].gifts.length > 0, "There is no list with that address!");
        Gift[] storage gifts = dataGiftLists[listOwner].lists[listOwner].gifts;
        for(uint i = 0; i < gifts.length; i++){
            if(id == gifts[i].id 
                && !gifts[i].gifted
                && gifts[i].price <= msg.value){
                gifts[i].gifter = msg.sender;
                gifts[i].gifted = true;
                balance += msg.value - gifts[i].price;
                emit ListUpdated(listOwner);
                return true;
            }
        }
        return false;
    }

    //Função para finalizar o contrato e enviar todo o dinheiro para o dono da conta
    // Caso a soma seja 0, retorna false pois não vai transferir nada ao remetente.
    // @Parametros: apenas msg.sender
    // @Retorno: true caso transferiu, false caso contrário.
    function finishList() public onlyListOwner(msg.sender) returns (bool){
        uint value = sumUpGiftValues(msg.sender);

        //Se não houve nenhum valor, não faz nada
        if(value == 0){
            return false;
        }

        msg.sender.transfer(value);

        dataGiftLists[msg.sender]._isDeleted = true;
        deleteObjectFromArray(msg.sender);

        emit ListUpdated(msg.sender);
        return true;
    }

    //Função para retornar os dados de uma lista específica
    // @Parametros: addr (endereço do dono da lista)
    // @Retorno: lista encontrada.
    function returnList(address addr) public view returns(GiftList memory){
        require(dataGiftLists[addr]._isDeleted == false, "This list doesn't exist!");
        GiftList memory giftList;
        giftList.hostsName = dataGiftLists[addr].lists[addr].hostsName;
        giftList.eventName = dataGiftLists[addr].lists[addr].eventName;
        giftList.message = dataGiftLists[addr].lists[addr].message;
        giftList.eventDate = dataGiftLists[addr].lists[addr].eventDate;
        giftList.ownerAddress = dataGiftLists[addr].lists[addr].ownerAddress;
        giftList.gifts = dataGiftLists[addr].lists[addr].gifts;
        return giftList;
    }

    //Função para retornar todas as litas do contrato, sem a informação dos presentes de cada uma.
    // @Parametros: -  
    // @Retorno: lista de todas as listas.
    function returnAllLists() public view returns(GiftList[] memory){
        GiftList[] memory listaDeListas = new GiftList[](listOwnersAddresses.length);
        for(uint i = 0; i < listOwnersAddresses.length; i++){
            if(dataGiftLists[listOwnersAddresses[i]]._isDeleted){
                continue;
            }
            GiftList memory lista;
            Gift[] memory presentes;
            lista.hostsName = dataGiftLists[listOwnersAddresses[i]].lists[listOwnersAddresses[i]].hostsName;
            lista.eventName = dataGiftLists[listOwnersAddresses[i]].lists[listOwnersAddresses[i]].eventName;
            lista.message = dataGiftLists[listOwnersAddresses[i]].lists[listOwnersAddresses[i]].message;
            lista.eventDate = dataGiftLists[listOwnersAddresses[i]].lists[listOwnersAddresses[i]].eventDate;
            lista.ownerAddress = dataGiftLists[listOwnersAddresses[i]].lists[listOwnersAddresses[i]].ownerAddress;
            lista.gifts = presentes;
            listaDeListas[i] = lista;
        }
        return listaDeListas;
    }

    ////Soma todos os valores de presente que já foram presenteados e retorna
    // @Parametros: addr (endereço da lista contendo os presentes)
    // @Retorno: soma dos valores de todos os presentes.
    
    function sumUpGiftValues(address addr) internal view returns(uint){
        uint sum = 0;
        Gift[] memory gifts = dataGiftLists[addr].lists[addr].gifts;

        //Adiciona apenas os presentes que foram dados de fato
        for(uint i = 0; i < gifts.length; i++){
            if(gifts[i].gifted){
                sum += gifts[i].price;
            }
        }
        return sum;
    }

    //Função auxiliar para deletar objeto do array de donos de lista
    //@Parametros: endereço a ser deletado
    //@Retorno: true caso deletou, false caso contrário.
    function deleteObjectFromArray(address addr) internal returns (bool){
        for(uint i = 0; i < listOwnersAddresses.length; i++){
            if(listOwnersAddresses[i] == addr){
                listOwnersAddresses[i] = listOwnersAddresses[listOwnersAddresses.length - 1];
                listOwnersAddresses.pop();
                return true;
            }
        }
        return false;
    }

    //Função auxiliar para retornar o código em uint256
    function hash(uint value, string memory name, string memory imageLink, address addr) internal pure returns(uint256){
        return uint256(keccak256(abi.encodePacked(addr, name, imageLink, value)));
    }

}