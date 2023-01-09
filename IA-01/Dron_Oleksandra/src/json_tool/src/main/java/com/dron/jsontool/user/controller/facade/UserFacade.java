package com.dron.jsontool.user.controller.facade;

import com.dron.jsontool.user.controller.dto.AuthDto;
import com.dron.jsontool.user.controller.dto.UserDto;

public interface UserFacade {

	UserDto save(UserDto userDto);

	UserDto getAuthUser();

	UserDto auth(AuthDto authDto);

}
