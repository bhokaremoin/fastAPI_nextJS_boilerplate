import base64

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding

# Load Private Key from File
with open("app/keys/private_key.pem", "rb") as f:
    private_key = serialization.load_pem_private_key(
        f.read(),
        password=None
    )

# Load Public Key from File
with open("app/keys/public_key.pem", "rb") as f:
    public_key = serialization.load_pem_public_key(f.read())


class EncryptionService:
    def __init__(self):
        pass

    @staticmethod
    def encrypt(password: str) -> str:
        encrypted_password = public_key.encrypt(
            password.encode('utf-8'),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        return base64.b64encode(encrypted_password).decode('utf-8')

    @staticmethod
    def decrypt(encrypted_message: str) -> str:
        encrypted_message_bytes = base64.b64decode(encrypted_message)
        decrypted_message = private_key.decrypt(
            encrypted_message_bytes,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        return decrypted_message.decode('utf-8')
