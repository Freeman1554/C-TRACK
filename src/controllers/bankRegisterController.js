import BankRegister from "../models/bankRegister.js";
import { branches } from "../services/accessapi.js";


async function createBank(req, res){
    try {
        const bank = await BankRegister.create({
        bank: req.body.bank,
        branchname: req.body.branchname,
        branchaddress: req.body.branchaddress,
        localgovt: req.body.localgovt,
        state: req.body.state
      });
       res.status(201).json({
        message: "Bank registered successfully",
        data: bank
       });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const getBranchDetails = async (req, res)=>{
    try {
        const{ bank, state, localgovt}=req.query;
        
        let where = {};
        //optional filters
        if(bank) where.bank = bank;
        if(state) where.state = state;
        if(localgovt) where.localgovt = localgovt;
        
        //return only branchname column
        const branches = await BankRegister.findAll({
            where, attributes:["branchname"] // only return branchname
        });
        
        if(branches.length === 0){
            return res.status(404).json({message:"No branch found"});
        }
        //res.json(branches);

        //Extracts brancname only
        const branchName = branches.map(b=>b.branchname);
        return res.json(branchName);

    } catch(error) {
        console.error("Error fetching branch names:", error);
        res.status(500).json({message:"internal server error"});
    }
};

export const getBranchAddresses = async(req, res)=> {
    try {
        const {bank, branchname, state, localgovt } = req.query;
        let where ={};

        if(bank) where.bank = bank;
        if(branchname) where.branchname = branchname;
        if(state) where.state = state;
        if(localgovt) where.localgovt = localgovt;

        //return only branchaddress
        const branchaddr = await BankRegister.findAll({
            where, attributes:["branchaddress"] // only return branchaddress
        });
        if(branchaddr.length === 0) {
            return res.status(404).json({message: "No branch address found"});
        }
        //Extract branchaddress only
            const addressList = branchaddr.map(b=>b.branchaddress);
            return res.json({addresses: addressList})
        
    } catch (error){
        console.error("Error fetching branch address:", error);
        return res.status(500).json({message:"Internal server error"});
    }
} 

export const getBranchLocalGovt = async(req,res)=> {
    try{
        const{bank, branchname, branchaddress, state}= req.query;
        let where = {};
        if(bank) where.bank = bank;
        if(branchname) where.branchname = branchname;
        if(branchaddress) where.branchaddress = branchaddress;
        if(state) where.state = state;

        const branchLocal = await BankRegister.findAll({
            where, attributes:["localgovt"]
        });
        if(branchLocal.length === 0) {
            return res.status(404).json({message:"No local govt. address found"});
        }
        const localGovtList = branchLocal.map(b => b.localgovt);
        return res.json({address: localGovtList})
    } catch(error){
        console.error("Error fetching branch address:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const getBankState = async(req, res)=> {
    try{
        const {bank, branchname, branchaddress, localgovt} = req.query;
        let where = {};
        if(bank) where.bank = bank;
        if(branchname) where.branchname = branchname;
        if(branchaddress) where.branchaddress = branchaddress;
        if(localgovt) where.localgovt = localgovt;
        const bankState = await BankRegister.findAll({where, attributes:["state"]});
        if(bankState.length === 0) {
            return res.status(404).json({message:"State is not found"})
        }
        const stateList =bankState.map(b=>b.state);
        return res.json({stateList})
    } catch(error){
        console.error("Error fetching state list:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export default createBank;