package com.weoohh.agar.utils;

import java.util.Random;

public class Formulas {

	public static int getRandomValue(int i1, int i2)
	{
		if (i2 < i1)
			return 0;
		Random rand = new Random();
		return (rand.nextInt((i2 - i1) + 1)) + i1;
	}
}
