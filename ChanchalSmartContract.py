from asyncore import write
from operator import gt
from pyteal import *

Var = Bytes("Counter")
Var2 = Bytes("Addition Value")
OutputVar1 = Bytes("OutputVariable")
CreatedAssetID = Bytes("Official Asset ID")

def approval_program():
    read_Adder = App.localGet(Txn.accounts[0] ,Var2)
    read_Counter = App.globalGet(Var)   
    

    # writeSomething = Seq([App.globalPut( Var2 , Int(1999) ),App.globalPut(OutputVar1,Bytes("Output Value X")) , Int(1)])
    writeSomething = Seq([App.globalPut( Var , Int(0) ),App.globalPut(OutputVar1,Bytes("Output Value X")),App.globalPut(CreatedAssetID,Bytes("Asset ID not Created")) , Int(1)])

    setupLocalAdder = Seq([App.localPut(Txn.accounts[0], Var2 , Int(1)) , Int(1)])
    
    addSomething = Seq([App.globalPut(Var,Add(read_Counter,read_Adder)),Int(1)])


    assetCreation = Seq([InnerTxnBuilder.Begin(),
     InnerTxnBuilder.SetFields({
    TxnField.type_enum: TxnType.AssetConfig,
    TxnField.config_asset_total: Int(1000000),
    TxnField.config_asset_decimals: Int(3),
    TxnField.config_asset_unit_name: Bytes("CANDIES"),
    TxnField.config_asset_name: Bytes("CANDIE COIN"),
    TxnField.config_asset_url: Bytes("https://gold.rush"),
    TxnField.config_asset_manager: Global.current_application_address(),
    TxnField.config_asset_reserve: Global.current_application_address(),
    TxnField.config_asset_freeze: Global.current_application_address(),
    TxnField.config_asset_clawback: Global.current_application_address()
    }),
    InnerTxnBuilder.Submit(),
    App.globalPut(CreatedAssetID, InnerTxn.created_asset_id()),Int(1) ])

    ## Created Asset Id is not getting assigned to CreatedAssetID variable....please check it later

    incrementAdder = Seq([App.localPut(Txn.accounts[0], Var2 ,Add(read_Adder,Int(1))),Int(1)])

    #If(Eq(read_Counter,Int(2)),assetCreation,Approve())


    checkBalanceOfAsset = Seq([AssetHolding.balance(Txn.accounts[1], App.globalGet(CreatedAssetID)), Int(1)])

    program = Cond(
    [ Txn.application_id() == Int( 0 ) , writeSomething ],
    [ Txn.on_completion() == OnComplete.OptIn, (Int(1)) ],
    [ Txn.application_args[0] == Bytes("SET"), setupLocalAdder],
    [ Txn.application_args[0] == Bytes("ADD"), addSomething ],
    [ Txn.application_args[0] == Bytes("INCR"), incrementAdder],
    [ Txn.application_args[0] == Bytes("BLNCE"), checkBalanceOfAsset],
    [ Txn.application_args[0] == Bytes("ASSET"), assetCreation]
    )
    
    return program

    


def clear_program():
    return Approve()    


if __name__ == "__main__":
    contract_approval_code = compileTeal(approval_program(), Mode.Application, version=5)
    with open('./build/approvalCode.teal', 'w') as f:
        f.write(contract_approval_code)
    contract_clear_code = compileTeal(clear_program(), Mode.Application, version=5)    
    with open('./build/clearCode.teal', 'w') as f:
        f.write(contract_clear_code)

