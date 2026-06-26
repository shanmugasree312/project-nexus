// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ProjectNexusLedger
 * @author Senior Blockchain Architect
 * @notice Implements a Soulbound Token (SBT) framework tracking dynamic cognitive metrics.
 * @dev Reverts all standard ERC-721 transfer mechanics to enforce non-transferability.
 */
contract ProjectNexusLedger is ERC721URIStorage, Ownable {
    
    uint256 private _currentTokenId;

    // Custom errors for gas optimization and clarity
    error TokenIsSoulboundAndNonTransferable();
    error TokenQueryForNonexistentToken();
    error InvalidRecipientAddress();
    error EmptyTokenURIString();

    event CredentialIssued(address indexed recipient, uint256 indexed tokenId, string tokenURI);
    event CredentialMetadataUpdated(uint256 indexed tokenId, string newTokenURI);

    constructor() ERC721("Project Nexus Cognitive Ledger", "NEXUS") Ownable(msg.sender) {
        _currentTokenId = 0;
    }

    /**
     * @notice Issues a unique non-transferable cognitive credential to a student.
     * @param recipient The wallet address of the student receiving the credential.
     * @param metadataURI The decentralized storage URI (IPFS/Arweave) pointing to the core metrics.
     * @return The newly minted token ID.
     */
    function issueCredential(address recipient, string calldata metadataURI) 
        external 
        onlyOwner 
        returns (uint256) 
    {
        if (recipient == address(0)) revert InvalidRecipientAddress();
        if (bytes(metadataURI).length == 0) revert EmptyTokenURIString();

        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;

        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        emit CredentialIssued(recipient, newTokenId, metadataURI);
        return newTokenId;
    }

    /**
     * @notice Updates the metadata URI for a token dynamically as cognitive scores evolve.
     * @param tokenId The identifier of the credential being updated.
     * @param newTokenURI The updated metadata JSON URI.
     */
    function updateTokenURI(uint256 tokenId, string calldata newTokenURI) 
        external 
        onlyOwner 
    {
        if (bytes(newTokenURI).length == 0) revert EmptyTokenURIString();
        if (_ownerOf(tokenId) == address(0)) revert TokenQueryForNonexistentToken();

        _setTokenURI(tokenId, newTokenURI);
        emit CredentialMetadataUpdated(tokenId, newTokenURI);
    }

    /**
     * @dev Overrides transferFrom to lock the token within the original recipient's wallet.
     */
    function transferFrom(address from, address to, uint256 tokenId) 
        public 
        override(ERC721, IERC721) 
    {
        from; to; tokenId; // Silence unused parameter warnings securely
        revert TokenIsSoulboundAndNonTransferable();
    }

    /**
     * @dev Overrides safeTransferFrom to prevent movement of the asset.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) 
        public 
        override(ERC721, IERC721) 
    {
        from; to; tokenId; data;
        revert TokenIsSoulboundAndNonTransferable();
    }
}
