//
//  TestRunnerProtocol.swift
//  Thali
//
//  Copyright (C) Microsoft. All rights reserved.
//  Licensed under the MIT license.
//  See LICENSE.txt file in the project root for full license information.
//

@objc
protocol TestRunnerProtocol {

  func runNativeTests() -> String
}
