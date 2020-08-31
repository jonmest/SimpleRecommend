package utils

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/gob"
	"encoding/hex"
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