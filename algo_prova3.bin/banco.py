import json

def criar_conta():
    conta = {
        "nome": input("Qual seu nome? \n"),
        "cpf": input("Digite seu cpf: \n"),
        "telefone": input("Digite seu numero de telefone: \n")
    }
    return conta

def carregar_conta():
    try:
        with open("conta.json", "r", encoding="utf-8" ) as f:
            return json.load(f)
    except FileNotFoundError:
        return None

def salvar_conta(conta):
    try:
        with open("conta.json", "w", encoding="utf-8") as f:
            json.dump(conta, f, ensure_ascii=False, indent=2)
        print("conta guardada com sucesso!")
    except Exception as e:
        print(f"Erro ao guardar: {e}")


print("Olá, bem vindo ao banco ETEC")

resposta = input("Você ja tem uma conta? s/n \n").lower()

if resposta == 'n':
    print("Vamos criar sua conta!")
    conta = criar_conta()

    salvar_conta(conta)

if resposta == "s":
    busca = {
        "cpf": input("Digite seu cpf: \n")
    }
    try: 
        carregar_conta(busca)
        
    except NameError:
        print("nsei")



