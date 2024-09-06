import { verifyMessage } from "ethers"; 

export const SIGN_UP_MESSAGE = "Sign Up";
export const SIGN_IN_MESSAGE = "Sign In";

export const verifySignup = async (signer: `0x${string}`, message: `0x${string}`): Promise<boolean> => {
    const recoveredAddress = verifyMessage(SIGN_UP_MESSAGE, message);

    return recoveredAddress == signer;
}

export const verifySignin = async (message: `0x${string}`): Promise<string> => {
    const recoveredAddress = verifyMessage(SIGN_IN_MESSAGE, message);

    return recoveredAddress;
}