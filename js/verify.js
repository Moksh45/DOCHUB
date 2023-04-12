window.CONTRACT = {
  address: '0x61609D4a775Cb4bF3D5d9f4D013C7Bac80c4a12f',
  network: 'https://matic-mumbai.chainstacklabs.com',
  explore: 'https://mumbai.polygonscan.com/',
  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_info",
          "type": "string"
        }
      ],
      "name": "add_Exporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "hash",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "_ipfs",
          "type": "string"
        }
      ],
      "name": "addDocHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_newInfo",
          "type": "string"
        }
      ],
      "name": "alter_Exporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_exporter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "addHash",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "changeOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        }
      ],
      "name": "delete_Exporter",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "deleteHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "count_Exporters",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "count_hashes",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "findDocHash",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_add",
          "type": "address"
        }
      ],
      "name": "getExporterInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
}
const web3 = new Web3(new Web3.providers.HttpProvider(window.CONTRACT.network))
const contract = new web3.eth.Contract(
  window.CONTRACT.abi,
  window.CONTRACT.address,
)

window.onload = async () => {
  $('#loader').hide()
  $('.loader-wraper').fadeOut('slow')
  checkURL()
  $('#upload_file_button').attr('disabled', true)
}

async function verify_Hash() {
  $('#loader').show()
  if (window.hashedfile) {
    /*   I used the contract address as the caller of the function 'findDocHash'
        you can use any address because it used just for reading info from the contract
    */
    await contract.methods
      .findDocHash(window.hashedfile)
      .call({ from: window.userAddress})
      .then((result) => {
        console.log(result)
        $('.transaction-status').removeClass('d-none')
        window.newHash = result
        if ((result[0] != 0) & (result[1] != 0)) {
          print_info(result, true)
        } else {
          print_info(result, false)
        }
      })
  }
}

function checkURL() {
  let url_string = window.location.href
  let url = new URL(url_string)
  window.hashedfile = url.searchParams.get('hash')
  if (!window.hashedfile) return

  verify_Hash()
}

async function get_Sha3() {
  $('#note').html(`<h5 class="text-warning">Hashing Your Document 😴...</h5>`)
  $('#upload_file_button').attr('disabled', false)
  console.log('file changed')
  var file = await document.getElementById('doc-file').files[0]
  if (file) {
    var reader = new FileReader()
    reader.readAsText(file, 'UTF-8')
    reader.onload = async function (evt) {
      // var SHA256 = new Hashes.SHA256();
      // = SHA256.hex(evt.target.result);
      window.hashedfile = await web3.utils.soliditySha3(evt.target.result)
      console.log(`Document Hash : ${window.hashedfile}`)
      $('#note').html(
        `<h5 class="text-center text-info">Document Hashed  😎 </h5>`,
      )
    }
    reader.onerror = function (evt) {
      console.log('error reading file')
      return false
    }
  } else {
    window.hashedfile = null
    return false
  }
}


function truncateAddress(address) {
  if (!address) {
    return
  }
  return `${address.substr(0, 7)}...${address.substr(
    address.length - 8,
    address.length,
  )}`
}
