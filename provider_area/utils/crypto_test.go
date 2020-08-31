package utils

import (
	"fmt"
	"testing"
)

func TestCanGenerateAPIToken(t *testing.T) {
	_, err := GenerateAPIToken(
		"Thomas",
		"tom@gmail.com",
	)

	if err != nil {
		fmt.Println(err.Error())
		t.Fail()
	}
}

func TestDecryptingTokenWithIntegrity(t *testing.T) {
	token, err := GenerateAPIToken(
		"Thomas",
		"tom@gmail.com",
	)
	if err != nil {
		fmt.Println(err.Error())
		t.Fail()
	}

	decrypted, err := DecryptAPIToken(token)
	if err != nil {
		fmt.Println(err.Error())
		t.Fail()
	}

	if decrypted.Username != "Thomas" {
		t.Fail()
	}

	if decrypted.Email != "tom@gmail.com" {
		t.Fail()
	}
}
