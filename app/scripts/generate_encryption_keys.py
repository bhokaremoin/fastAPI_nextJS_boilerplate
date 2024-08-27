from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

# Generate RSA Key Pair (Only done once, then stored)
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048,
)

# Serialize Private Key and Save to a File
with open("private_key.pem", "wb") as f:
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    )
    f.write(private_pem)

# Serialize Public Key and Save to a File
with open("public_key.pem", "wb") as f:
    public_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    f.write(public_pem)

print(f"Private Key:-\n${private_pem.decode()}\n")
print(f"Public Key:-\n${public_pem.decode()}\n")
