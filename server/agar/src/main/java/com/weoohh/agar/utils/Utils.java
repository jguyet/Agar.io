package com.weoohh.agar.utils;

import java.util.Random;

public class Utils {

	public static String getRandomHexColor() {
		// create a big random number - maximum is ffffff (hex) = 16777215 (dez)
        int nextInt = new Random().nextInt(256*256*256);

        // format it as hexadecimal string (with hashtag and leading zeros)
        String colorCode = String.format("#%06x", nextInt);
        
        return colorCode;
	}
}
