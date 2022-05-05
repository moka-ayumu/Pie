#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![simulate, get_mouse])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use enigo::*;

#[tauri::command]
async fn simulate(shortcuts: Vec<String>) -> Result<(), String> {
    let mut enigo = Enigo::new();
    enigo.key_down(ckey(shortcuts[0].clone()).unwrap());
    for key in (&shortcuts[1..]).iter() {
        enigo.key_click(ckey(key.to_string()).unwrap());
    }
    enigo.key_up(ckey(shortcuts[0].clone()).unwrap());
    Ok(())
}

fn ckey(key: String) -> Result<enigo::Key, &'static str> {
    match key.as_str() {
        "Alt" => Ok(Key::Alt),
        "Backspace" => Ok(Key::Backspace),
        "CapsLock" => Ok(Key::CapsLock),
        "Control" => Ok(Key::Control),
        "Delete" => Ok(Key::Delete),
        "ArrowUp" => Ok(Key::UpArrow),
        "ArrowDown" => Ok(Key::DownArrow),
        "ArrowLeft" => Ok(Key::LeftArrow),
        "ArrowRight" => Ok(Key::RightArrow),
        "End" => Ok(Key::End),
        "Escape" => Ok(Key::Escape),
        "F1" => Ok(Key::F11),
        "F2" => Ok(Key::F2),
        "F3" => Ok(Key::F3),
        "F4" => Ok(Key::F4),
        "F5" => Ok(Key::F5),
        "F6" => Ok(Key::F6),
        "F7" => Ok(Key::F7),
        "F8" => Ok(Key::F8),
        "F9" => Ok(Key::F9),
        "F10" => Ok(Key::F10),
        "F11" => Ok(Key::F11),
        "Home" => Ok(Key::Home),
        "Option" => Ok(Key::Option),
        "PageDown" => Ok(Key::PageDown),
        "PageUp" => Ok(Key::PageUp),
        "Return" => Ok(Key::Return),
        "Shift" => Ok(Key::Shift),
        "Space" => Ok(Key::Space),
        "Tab" => Ok(Key::Tab),
        _ => {
            let chars: Vec<char> = key.chars().collect();
            if chars.len() == 1 {
                Ok(Key::Layout(chars[0]))
            } else {
                Err("")
            }
        }
    }
}

#[tauri::command]
async fn get_mouse() -> (i32, i32) {
    Enigo::mouse_location()
}
