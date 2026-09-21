import json

def depositar(conta, valor):
    if valor <= 0:
        print("O valor do deposito deve ser positivo.")
        return
    conta['saldo'] += valor
    conta['Historico'].append(f"Deposito de R$ {valor:.2f}")
    print(f"Deposito realizado. saldo atual: R$ {conta['saldo']:.2f}")

def sacar(conta, valor):
    if valor <= 0:
        print("O valor do levantamento deve ser positivo.")
        return
    if valor > conta["saldo"]:
        print(" Saldo insuficinete para este levantamento")
        return
    conta["saldo"] -= valor
    conta["Historico"].append(f"Levantamento de R$ {valor:.2f}")
    print(f"Levantamento concluido. Saldo atual: R$ {conta['saldo']}")

def extrato(conta):
    print(f"---EXTRATO DE {conta['nome'].upper()}----")
    if not conta["Historico"]:
        print("Nenhuma movimentação ainda.")
    else:
        for movimento in conta["Historico"]:
            print(f"{movimento}")
    print(f"Saldo atual: R$ {conta['saldo']:.2f}")

def criar_conta():
    conta = {
        "nome": input("Qual seu nome? \n"),
        "cpf": input("Digite seu cpf: \n"),
        "telefone": input("Digite seu numero de telefone: \n"),
        "pin": input("Insira um pin para a segurança de seus dados: \n"),
        "saldo": 0
        }
    return conta

def carregar_conta(conta, senha):
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
resposta = input("Deseja carregar uma conta existente? s/n \n")
if resposta == "n":
        print("Vamos criar sua conta!")
        conta = criar_conta()

        salvar_conta(conta)
  
if resposta == "s":
    senha = input("Digite sua senha: ")
    carregar_conta(conta, senha)

    while True:
        print(f"\nSaldo atual: R$ {conta['saldo']:.2f}")
        print("O que deseja fazer? \n")
        acao = int(input("1-depositar\n"
        "2-Levantar \n" \
        "3-Extrato \n" \
        ))

        match(acao):
            case 1:
                valor = float(input("Quanto deseja depositar em sua conta? "))
                depositar(conta, valor)
                salvar_conta(conta)
            case 2:
                valor = float(input("Quanto deseja sacar em sua conta? "))
                sacar(conta, valor)
                salvar_conta(conta)
            case 3:
                extrato(conta)


            


        

        



