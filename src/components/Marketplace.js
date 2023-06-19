import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
const sampleData = [
    {
        "name": "iPhone13",
        "description": "Fairly used iPhone13",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmVNY6toTR4zKHiDaX6sYFq8rZnxyzQ4rwt8umx4szWzQy",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0x562b11efe485b8586c2645540A1C50F093Ba81F5",
    },
    {
        "name": "Redmi9T",
        "description": "Redmi 9t dual sim 128gb tom 6gb ram blue colour very clean uk used",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmYs55Xx6f5rgojHr31ZV8gJ8DwA8sCtic7Ec9pNYm21tx",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0x562b11efe485b8586c2645540A1C50F093Ba81F5",
    },
    {
        "name": "Asus ROG Laptop",
        "description": "Asus ROG Strix SCAR 15 32GB Intel Core I7 SSD 1T Laptop.",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmQh5gZQLafXvuh6S5asiFdtyf2mUX9F1zfVTLZaYHKagy",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0x562b11efe485b8586c2645540A1C50F093Ba81F5",
    },
    ];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                Proof of Receipt
            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}