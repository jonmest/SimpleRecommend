package utils

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/gob"
	"encoding/hex"
	"io"
)

func Marshal(v interface{}) ([]byte, error) {
	b := new(bytes.Buffer)
	err := gob.NewEncoder(b).Encode(v)
	if err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}

func Unmarshal(data []byte, v interface{}) error {
	b := bytes.NewBuffer(data)
	return gob.NewDecoder(b).Decode(v)
}

type Payload struct {
	Username string
	Email    string
}

func GenerateAPIToken(username string, email string) (string, error) {
	var payload = Payload{
		Username: username,
		Email:    email,
	}

	// Setup key
	key, _ := hex.DecodeString("6368616e676520746869732070617373776f726420746f206120736563726574")
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	// Encode struct into bytes
	encoded, err := Marshal(payload)
	if err != nil {
		return "", err
	}

	// Setup a nonce to use for encrypting the encoded struct
	// Never use more than 2^32 random nonces with a given key because of the risk of a repeat.
	nonce := make([]byte, 12)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}
	nonceString := hex.EncodeToString(nonce)

	// Encrypt bytes using the nonce and AES and Galois Counter Mode
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	ciphertext := aesgcm.Seal(nil, nonce, encoded, nil)

	// Return a hex string with the 24 last characters being the nonce
	total_ciphertext := hex.EncodeToString(ciphertext) + nonceString
	return total_ciphertext, nil
}

func DecryptAPIToken(token string) (Payload, error) {
	// Setup key
	key, _ := hex.DecodeString("6368616e676520746869732070617373776f726420746f206120736563726574")
	block, err := aes.NewCipher(key)
	if err != nil {
		return Payload{}, err
	}
	aesgcm, err := cipher.NewGCM(block)
	if err != nil {
		return Payload{}, err
	}

	ciphertext, err := hex.DecodeString(token[:len(token)-24])
	if err != nil {
		return Payload{}, err
	}

	nonce, err := hex.DecodeString(token[len(token)-24:])
	if err != nil {
		return Payload{}, err
	}

	plaintext, err := aesgcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return Payload{}, err
	}

	var decoded Payload
	if err := Unmarshal(plaintext, &decoded); err != nil {
		return Payload{}, err
	}

	return decoded, nil
}
